import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, booking_date, booking_time, assigned_staff, manager_note } = body;

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true, user: true }
    });

    if (!existingBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    let newStatus = existingBooking.status;
    let title = "";
    let message = "";
    let updateData: any = {};

    if (assigned_staff) updateData.assigned_staff = assigned_staff;
    if (manager_note) updateData.manager_note = manager_note;
    if (user.role === "MANAGER") updateData.manager_id = user.id as string;

    if (action === "CONFIRM" || action === "ACCEPT" || action === "SCHEDULE") {
      newStatus = "CONFIRMED";
      if (booking_date) updateData.booking_date = new Date(booking_date);
      if (booking_time) updateData.booking_time = booking_time;
      updateData.status = newStatus;

      const dateStr = booking_date 
        ? new Date(booking_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date(existingBooking.booking_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' });

      const finalTime = booking_time || existingBooking.booking_time;
      const finalStaff = assigned_staff || existingBooking.assigned_staff || "Assigned Stylist";

      title = "Appointment Confirmed 🎉";
      message = `Your SS SALON appointment has been confirmed.\nService: ${existingBooking.service.name}\nDate: ${dateStr}\nTime: ${finalTime}\nAssigned Staff: ${finalStaff}\nDuration: ${existingBooking.service.duration} minutes\nAmount: ₹${existingBooking.total_amount}\nPlease arrive 5–10 minutes before your appointment.`;
    
    } else if (action === "RESCHEDULE") {
      newStatus = "RESCHEDULED";
      if (booking_date) updateData.booking_date = new Date(booking_date);
      if (booking_time) updateData.booking_time = booking_time;
      updateData.status = newStatus;

      const dateStr = booking_date 
        ? new Date(booking_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })
        : new Date(existingBooking.booking_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' });

      const finalTime = booking_time || existingBooking.booking_time;
      const finalStaff = assigned_staff || existingBooking.assigned_staff || "Assigned Stylist";

      title = "Appointment Rescheduled 📅";
      message = `Your SS SALON appointment for ${existingBooking.service.name} has been rescheduled to ${dateStr} at ${finalTime} with ${finalStaff}.`;

    } else if (action === "REJECT") {
      newStatus = "REJECTED";
      updateData.status = newStatus;
      title = "Appointment Request Declined";
      message = `Sorry, your booking request for ${existingBooking.service.name} could not be confirmed at this time.`;

    } else if (action === "CANCEL") {
      newStatus = "CANCELLED";
      updateData.status = newStatus;
      title = "Appointment Cancelled";
      message = `Your appointment for ${existingBooking.service.name} has been cancelled.`;

    } else if (action === "COMPLETE") {
      newStatus = "COMPLETED";
      updateData.status = newStatus;
      
      // Also update payment to paid if payment preference was pay after service
      await prisma.payment.updateMany({
        where: { booking_id: id },
        data: { payment_status: "PAID", payment_date: new Date() }
      });

      title = "Service Completed 🎉";
      message = `Thank you for visiting SS SALON! Your service (${existingBooking.service.name}) is completed. Please rate your experience!`;
    
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { user: true, service: true, manager: true }
    });

    // Create in-app notification for the customer
    await prisma.notification.create({
      data: {
        user_id: updatedBooking.user_id,
        booking_id: updatedBooking.id,
        title,
        message
      }
    });

    return NextResponse.json({
      message: "Booking updated successfully",
      booking: updatedBooking
    }, { status: 200 });

  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ message: "Failed to update booking" }, { status: 500 });
  }
}
