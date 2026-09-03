import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// PATCH - update manager email and/or password
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, email, phone, password, status } = await req.json();

    const existing = await prisma.serviceManager.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: "Manager not found" }, { status: 404 });

    // If email is being changed, check uniqueness
    if (email && email !== existing.email) {
      const emailTaken = await prisma.serviceManager.findUnique({ where: { email } });
      if (emailTaken) return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (status) updateData.status = status;
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.serviceManager.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ message: "Manager updated successfully", manager: updated }, { status: 200 });
  } catch (error) {
    console.error("Update manager error:", error);
    return NextResponse.json({ message: "Error updating manager" }, { status: 500 });
  }
}

// DELETE - deactivate manager
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await prisma.serviceManager.update({
      where: { id },
      data: { status: "INACTIVE" }
    });

    return NextResponse.json({ message: "Manager deactivated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deactivating manager" }, { status: 500 });
  }
}
