import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userPayload = await verifyToken(token);
    if (!userPayload || userPayload.role !== "CUSTOMER") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userPayload.id as string },
      select: { id: true, name: true, email: true, phone: true, gender: true }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { user_id: user.id },
      include: {
        service: true,
        manager: { select: { name: true, phone: true } },
        feedback: true
      },
      orderBy: { created_at: "desc" }
    });

    const notifications = await prisma.notification.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
      take: 10
    });

    return NextResponse.json({ user, bookings, notifications }, { status: 200 });
  } catch (error) {
    console.error("Customer dashboard fetch error:", error);
    return NextResponse.json({ message: "Error fetching dashboard data" }, { status: 500 });
  }
}
