import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.feedback.findMany({
      where: { status: "APPROVED" },
      include: {
        user: { select: { name: true } },
        service: { select: { name: true } }
      },
      orderBy: { created_at: "desc" },
      take: 10
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Public feedback fetch error:", error);
    return NextResponse.json({ reviews: [] }, { status: 500 });
  }
}
