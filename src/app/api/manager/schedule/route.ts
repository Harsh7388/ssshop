import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    let whereClause: any = {};
    if (dateStr) {
      const startOfDay = new Date(dateStr);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateStr);
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: { manager: true },
      orderBy: { date: "asc" }
    });

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.error("Fetch schedule error:", error);
    return NextResponse.json({ message: "Error fetching schedules" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, start_time, end_time, title, availability } = body;

    if (!date || !start_time) {
      return NextResponse.json({ message: "Date and start_time are required" }, { status: 400 });
    }

    const newSchedule = await prisma.schedule.create({
      data: {
        manager_id: user.id as string,
        date: new Date(date),
        start_time,
        end_time: end_time || start_time,
        title: title || "Break / Blocked",
        availability: availability !== undefined ? availability : false
      }
    });

    return NextResponse.json({ message: "Schedule block created", schedule: newSchedule }, { status: 201 });
  } catch (error) {
    console.error("Create schedule error:", error);
    return NextResponse.json({ message: "Failed to create schedule block" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "Schedule ID required" }, { status: 400 });

    await prisma.schedule.delete({ where: { id } });

    return NextResponse.json({ message: "Schedule block deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete schedule error:", error);
    return NextResponse.json({ message: "Failed to delete schedule block" }, { status: 500 });
  }
}
