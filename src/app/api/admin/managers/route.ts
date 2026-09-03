import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET all managers
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const managers = await prisma.serviceManager.findMany({ orderBy: { status: "asc" } });
    return NextResponse.json({ managers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching managers" }, { status: 500 });
  }
}

// POST create new manager
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, email, phone, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    const existing = await prisma.serviceManager.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ message: "Email already in use" }, { status: 400 });

    const password_hash = await bcrypt.hash(password, 10);
    const manager = await prisma.serviceManager.create({
      data: { name, email, phone: phone || null, password_hash, role: "MANAGER", status: "ACTIVE" }
    });

    return NextResponse.json({ message: "Manager created successfully", manager }, { status: 201 });
  } catch (error) {
    console.error("Create manager error:", error);
    return NextResponse.json({ message: "Error creating manager" }, { status: 500 });
  }
}
