import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "CUSTOMER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { booking_id, rating, comment } = body;

    if (!booking_id || !rating || !comment) {
      return NextResponse.json({ message: "Booking ID, rating and comment are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5 stars" }, { status: 400 });
    }

    // Verify booking belongs to this user and status is COMPLETED
    const booking = await prisma.booking.findUnique({
      where: { id: booking_id },
      include: { feedback: true }
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    if (booking.user_id !== user.id) {
      return NextResponse.json({ message: "You can only rate your own bookings" }, { status: 403 });
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json({ message: "Feedback can only be submitted for completed services" }, { status: 400 });
    }

    if (booking.feedback) {
      return NextResponse.json({ message: "Feedback has already been submitted for this booking" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        booking_id: booking.id,
        user_id: user.id as string,
        service_id: booking.service_id,
        rating: parseInt(rating, 10),
        comment: comment.trim(),
        status: "PENDING"
      },
      include: { service: true }
    });

    return NextResponse.json({
      message: "Feedback submitted successfully! It will be reviewed by admin before public display.",
      feedback
    }, { status: 201 });

  } catch (error) {
    console.error("Submit feedback error:", error);
    return NextResponse.json({ message: "Failed to submit feedback" }, { status: 500 });
  }
}
