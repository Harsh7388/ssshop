import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json({ message: "Date parameter required" }, { status: 400 });
    }

    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch non-cancelled and non-rejected bookings for this date
    const bookings = await prisma.booking.findMany({
      where: {
        booking_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          notIn: ["CANCELLED", "REJECTED"],
        },
      },
      select: {
        booking_time: true,
      },
    });

    // Also fetch blocked manager schedules for this date
    const schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        availability: false,
      },
      select: {
        start_time: true,
      },
    });

    const occupiedSlots = Array.from(
      new Set([
        ...bookings.map((b) => b.booking_time),
        ...schedules.map((s) => s.start_time),
      ])
    );

    const allTimeSlots = [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:30 PM",
      "04:00 PM",
      "05:30 PM",
      "07:00 PM",
    ];

    const availableSlots = allTimeSlots.filter((slot) => !occupiedSlots.includes(slot));

    return NextResponse.json({
      date: dateStr,
      allTimeSlots,
      occupiedSlots,
      availableSlots,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
