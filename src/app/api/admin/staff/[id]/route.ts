import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// PATCH - update staff member
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, role, phone, status } = await req.json();

    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (status) updateData.status = status;

    const updated = await prisma.staff.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ message: "Staff updated successfully", staff: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating staff" }, { status: 500 });
  }
}

// DELETE - remove staff
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.staff.delete({ where: { id } });
    return NextResponse.json({ message: "Staff removed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error removing staff" }, { status: 500 });
  }
}
