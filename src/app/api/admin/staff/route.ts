import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET all staff
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const staff = await prisma.staff.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ staff }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching staff" }, { status: 500 });
  }
}

// POST create new staff
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = await verifyToken(token);
    if (!user || user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, role, phone } = await req.json();
    if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

    const staff = await prisma.staff.create({
      data: { name, role: role || "STYLIST", phone: phone || null, status: "ACTIVE" }
    });

    return NextResponse.json({ message: "Staff added successfully", staff }, { status: 201 });
  } catch (error) {
    console.error("Create staff error:", error);
    return NextResponse.json({ message: "Error adding staff" }, { status: 500 });
  }
}
