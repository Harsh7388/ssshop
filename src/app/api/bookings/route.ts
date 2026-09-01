import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function generateBookingNumber() {
  return `SS-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    
    const user = await verifyToken(token);
    if (!user || user.role !== 'CUSTOMER') return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { service_id, booking_date, booking_time, notes, payment_preference, total_amount } = body;

    const targetDate = new Date(booking_date);
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
        user_id: user.id as string,
        service_id,
        booking_date: new Date(booking_date),
        booking_time,
        notes,
        payment_preference,
        total_amount,
        status: "REQUESTED",
        payments: {
          create: {
            amount: total_amount,
            payment_method: payment_preference === 'PAY_NOW' ? 'ONLINE' : 'CASH',
            payment_status: payment_preference === 'PAY_NOW' ? 'PAID' : 'PAY_AFTER_SERVICE'
          }
        },
        notifications: {
          create: {
            user_id: user.id as string,
            title: "Booking Request Submitted",
            message: `Your request for booking on ${booking_date} at ${booking_time} has been submitted.`
          }
        }
      },
      include: {
        service: true
      }
    });

    return NextResponse.json({ message: "Booking created", booking }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ message: "Failed to create booking" }, { status: 500 });
  }
}
