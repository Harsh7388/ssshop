import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
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

    let staff = await prisma.staff.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" }
    });

    if (staff.length === 0) {
      const defaultStaff = [
        { name: "Rahul Sharma", role: "SENIOR_STYLIST", phone: "9876543210", status: "ACTIVE" },
        { name: "Priya Singh", role: "HAIR_COLORIST", phone: "9876543211", status: "ACTIVE" },
        { name: "Amit Verma", role: "MASTER_BARBER", phone: "9876543212", status: "ACTIVE" },
        { name: "Sneha Patel", role: "BEAUTICIAN_SPA", phone: "9876543213", status: "ACTIVE" },
        { name: "Kunal Mehra", role: "STYLIST", phone: "9876543214", status: "ACTIVE" }
      ];
      try {
        for (const s of defaultStaff) {
          await prisma.staff.create({ data: s });
        }
        staff = await prisma.staff.findMany({
          where: { status: "ACTIVE" },
          orderBy: { name: "asc" }
        });
      } catch (e) {
        console.error("Auto-seeding staff error:", e);
      }
    }

    return NextResponse.json({ requests, schedules, staff }, { status: 200 });
  } catch (error) {
    console.error("Fetch manager requests error:", error);
    return NextResponse.json({ message: "Error fetching requests" }, { status: 500 });
  }
}

