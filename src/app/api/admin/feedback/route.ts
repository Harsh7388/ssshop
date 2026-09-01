import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        service: { select: { id: true, name: true } },
        booking: { select: { id: true, booking_number: true, booking_date: true } }
      },
      orderBy: { created_at: "desc" }
    });

    const totalReviews = feedbacks.length;
    const pendingReviews = feedbacks.filter(f => f.status === "PENDING").length;
    const approvedReviews = feedbacks.filter(f => f.status === "APPROVED").length;
    const rejectedReviews = feedbacks.filter(f => f.status === "REJECTED").length;
    
    const totalRatingSum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    const avgRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : "0.0";

    return NextResponse.json({
      stats: {
        totalReviews,
        pendingReviews,
        approvedReviews,
        rejectedReviews,
        avgRating
      },
      feedbacks
    }, { status: 200 });

  } catch (error) {
    console.error("Admin feedback fetch error:", error);
    return NextResponse.json({ message: "Error fetching feedback" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body; // APPROVED, REJECTED, PENDING

    if (!id || !status) {
      return NextResponse.json({ message: "ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ message: `Feedback ${status.toLowerCase()}`, feedback: updated }, { status: 200 });
  } catch (error) {
    console.error("Admin feedback update error:", error);
    return NextResponse.json({ message: "Failed to update feedback" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 });

    await prisma.feedback.delete({ where: { id } });

    return NextResponse.json({ message: "Feedback deleted" }, { status: 200 });
  } catch (error) {
    console.error("Admin feedback delete error:", error);
    return NextResponse.json({ message: "Failed to delete feedback" }, { status: 500 });
  }
}
