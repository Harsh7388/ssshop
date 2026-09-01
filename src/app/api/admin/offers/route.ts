import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      include: { service: true },
      orderBy: { start_date: "desc" }
    });
    return NextResponse.json({ offers }, { status: 200 });
  } catch (error) {
    console.error("Fetch offers error:", error);
    return NextResponse.json({ offers: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      discount,
      discountType,
      original_price,
      offer_price,
      start_date,
      end_date,
      status,
      service_id,
      gender,
      image
    } = body;

    if (!title || !description || !discount || !start_date || !end_date) {
      return NextResponse.json({ message: "Required offer fields missing" }, { status: 400 });
    }

    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        discount: parseFloat(discount),
        discountType: discountType || "PERCENTAGE",
        original_price: original_price ? parseFloat(original_price) : null,
        offer_price: offer_price ? parseFloat(offer_price) : null,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        status: status || "ACTIVE",
        service_id: service_id || null,
        gender: gender || "BOTH",
        image: image || null
      }
    });

    return NextResponse.json({ message: "Offer created successfully", offer }, { status: 201 });
  } catch (error) {
    console.error("Create offer error:", error);
    return NextResponse.json({ message: "Failed to create offer" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      description,
      discount,
      discountType,
      original_price,
      offer_price,
      start_date,
      end_date,
      status,
      service_id,
      gender,
      image
    } = body;

    if (!id) return NextResponse.json({ message: "Offer ID required" }, { status: 400 });

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        title,
        description,
        discount: parseFloat(discount),
        discountType: discountType || "PERCENTAGE",
        original_price: original_price ? parseFloat(original_price) : null,
        offer_price: offer_price ? parseFloat(offer_price) : null,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        status: status || "ACTIVE",
        service_id: service_id || null,
        gender: gender || "BOTH",
        image: image || null
      }
    });

    return NextResponse.json({ message: "Offer updated successfully", offer }, { status: 200 });
  } catch (error) {
    console.error("Update offer error:", error);
    return NextResponse.json({ message: "Failed to update offer" }, { status: 500 });
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
    const { id, status } = body; // ACTIVE / INACTIVE

    if (!id || !status) return NextResponse.json({ message: "ID and status required" }, { status: 400 });

    const offer = await prisma.offer.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ message: `Offer ${status === 'ACTIVE' ? 'activated' : 'deactivated'}`, offer }, { status: 200 });
  } catch (error) {
    console.error("Toggle offer error:", error);
    return NextResponse.json({ message: "Failed to toggle offer status" }, { status: 500 });
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

    if (!id) return NextResponse.json({ message: "Offer ID required" }, { status: 400 });

    await prisma.offer.delete({ where: { id } });

    return NextResponse.json({ message: "Offer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete offer error:", error);
    return NextResponse.json({ message: "Failed to delete offer" }, { status: 500 });
  }
}
