import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, gender, description, price, discount_price, duration, image, status } = body;

    if (!name || !category || !gender || !description || !price || !duration) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        name,
        category,
        gender,
        description,
        price: parseFloat(price),
        discount_price: discount_price ? parseFloat(discount_price) : null,
        duration: parseInt(duration, 10),
        image: image || null,
        status: status || "ACTIVE"
      }
    });

    return NextResponse.json({ message: "Service created successfully", service }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ message: "Failed to create service" }, { status: 500 });
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
    const { id, name, category, gender, description, price, discount_price, duration, image, status } = body;

    if (!id) return NextResponse.json({ message: "Service ID required" }, { status: 400 });

    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        category,
        gender,
        description,
        price: parseFloat(price),
        discount_price: discount_price ? parseFloat(discount_price) : null,
        duration: parseInt(duration, 10),
        image: image || null,
        status: status || "ACTIVE"
      }
    });

    return NextResponse.json({ message: "Service updated successfully", service }, { status: 200 });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ message: "Failed to update service" }, { status: 500 });
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

    const service = await prisma.service.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ message: `Service ${status === 'ACTIVE' ? 'activated' : 'deactivated'}`, service }, { status: 200 });
  } catch (error) {
    console.error("Toggle service error:", error);
    return NextResponse.json({ message: "Failed to toggle service status" }, { status: 500 });
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

    if (!id) return NextResponse.json({ message: "Service ID required" }, { status: 400 });

    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ message: "Failed to delete service" }, { status: 500 });
  }
}
