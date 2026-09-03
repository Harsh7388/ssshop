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

    const requests = await prisma.booking.findMany({
      include: {
        service: true,
        user: { select: { id: true, name: true, email: true, phone: true, gender: true } },
        manager: { select: { id: true, name: true } },
        payments: true,
        feedback: true
      },
      orderBy: { created_at: "desc" }
    });

    const schedules = await prisma.schedule.findMany({
      orderBy: { date: "asc" }
    });

    const staff = await prisma.staff.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ requests, schedules, staff }, { status: 200 });
  } catch (error) {
    console.error("Fetch manager requests error:", error);
    return NextResponse.json({ message: "Error fetching requests" }, { status: 500 });
  }
}

