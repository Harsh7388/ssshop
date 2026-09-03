import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function generateBookingNumber() {
  return `SS-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized. Please log in to book an appointment." }, { status: 401 });
    }
    
    const userPayload = await verifyToken(token);
    if (!userPayload || userPayload.role !== 'CUSTOMER') {
      return NextResponse.json({ message: "Unauthorized. Please log in as a customer." }, { status: 401 });
    }

    // Verify user exists in DB
    const dbUser = await prisma.user.findUnique({
      where: { id: userPayload.id as string }
    });
    if (!dbUser) {
      return NextResponse.json({ message: "User account not found. Please log in again." }, { status: 401 });
    }

    const body = await req.json();
    const { service_id, booking_date, booking_time, notes, payment_preference, total_amount } = body;

    if (!service_id || !booking_date || !booking_time) {
      return NextResponse.json({ message: "Missing required booking details (service, date, or time)." }, { status: 400 });
    }

    // Verify service exists in DB
    const dbService = await prisma.service.findUnique({
      where: { id: service_id }
    });
    if (!dbService) {
      return NextResponse.json({ message: "Selected service was not found or is no longer active." }, { status: 404 });
    }

    const finalAmount = Number(total_amount) > 0 ? Number(total_amount) : Number(dbService.price);

    const targetDate = new Date(booking_date);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ message: "Invalid booking date format." }, { status: 400 });
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Strict double booking prevention
    const existing = await prisma.booking.findFirst({
      where: {
        booking_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        booking_time,
        status: { notIn: ['CANCELLED', 'REJECTED'] }
      }
    });

    if (existing) {
      return NextResponse.json({
        message: `The time slot ${booking_time} on ${booking_date} is already occupied. Please select another time.`
      }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        booking_number: generateBookingNumber(),
        user_id: dbUser.id,
        service_id: dbService.id,
        booking_date: targetDate,
        booking_time,
        notes: notes || null,
        payment_preference: payment_preference || "PAY_AFTER_SERVICE",
        total_amount: finalAmount,
        status: "REQUESTED",
        payments: {
          create: {
            amount: finalAmount,
            payment_method: payment_preference === 'PAY_NOW' ? 'ONLINE' : 'CASH',
            payment_status: payment_preference === 'PAY_NOW' ? 'PAID' : 'PAY_AFTER_SERVICE'
          }
        },
        notifications: {
          create: {
            user_id: dbUser.id,
            title: "Booking Request Submitted",
            message: `Your appointment request for ${dbService.name} on ${booking_date} at ${booking_time} has been submitted.`
          }
        }
      },
      include: {
        service: true
      }
    });

    return NextResponse.json({ message: "Booking created successfully", booking }, { status: 201 });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({ message: error?.message || "Failed to create booking. Please try again." }, { status: 500 });
  }
}
