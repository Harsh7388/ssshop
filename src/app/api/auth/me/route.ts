import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verify user still active in DB
    let user: any = null;
    if (payload.role === 'CUSTOMER') {
      user = await prisma.user.findUnique({
        where: { id: payload.id as string },
        select: { id: true, name: true, email: true, phone: true, gender: true, status: true }
      });
    } else {
      user = await prisma.serviceManager.findUnique({
        where: { id: payload.id as string },
        select: { id: true, name: true, email: true, phone: true, role: true, status: true }
      });
    }

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: payload.role as string
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Auth me check error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
