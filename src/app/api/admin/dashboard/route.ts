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

    const [
      totalUsers,
      totalBookings,
      totalServicesCount,
      users,
      managers,
      services,
      offers,
      bookings,
      feedbacks,
      payments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.service.count({ where: { status: "ACTIVE" } }),
      prisma.user.findMany({ orderBy: { created_at: "desc" } }),
      prisma.serviceManager.findMany({ orderBy: { status: "asc" } }),
      prisma.service.findMany({ orderBy: { category: "asc" } }),
      prisma.offer.findMany({ orderBy: { start_date: "desc" } }),
      prisma.booking.findMany({
        include: {
          service: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
          manager: { select: { id: true, name: true } },
          payments: true
        },
        orderBy: { created_at: "desc" }
      }),
      prisma.feedback.findMany({
        include: {
          user: { select: { name: true, email: true } },
          service: { select: { name: true } },
          booking: { select: { booking_number: true } }
        },
        orderBy: { created_at: "desc" }
      }),
      prisma.payment.findMany({
        include: {
          booking: {
            include: {
              user: { select: { name: true } },
              service: { select: { name: true } }
            }
          }
        },
        orderBy: { id: "desc" }
      })
    ]);

    const totalRevenue = bookings
      .filter((b) => ["CONFIRMED", "COMPLETED"].includes(b.status))
      .reduce((acc, b) => acc + (b.total_amount || 0), 0);

    const feedbackStats = {
      totalReviews: feedbacks.length,
      pendingReviews: feedbacks.filter((f) => f.status === "PENDING").length,
      approvedReviews: feedbacks.filter((f) => f.status === "APPROVED").length,
      rejectedReviews: feedbacks.filter((f) => f.status === "REJECTED").length,
      avgRating: feedbacks.length > 0 ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1) : "0.0"
    };

    const stats = {
      totalUsers,
      totalBookings,
      totalServices: totalServicesCount,
      totalRevenue,
      feedbackStats
    };

    return NextResponse.json({
      stats,
      users,
      managers,
      services,
      offers,
      bookings,
      feedbacks,
      payments
    }, { status: 200 });

  } catch (error) {
    console.error("Admin dashboard fetch error:", error);
    return NextResponse.json({ message: "Error fetching admin data" }, { status: 500 });
  }
}
