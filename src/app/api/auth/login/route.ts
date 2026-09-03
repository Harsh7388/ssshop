import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body || {};
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    let user: any = null;
    let userRole = role || 'CUSTOMER';

    if (userRole === 'CUSTOMER') {
      user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      // Fallback: in case customer tab was selected but it's a manager/admin account
      if (!user) {
        const mgr = await prisma.serviceManager.findUnique({ where: { email: normalizedEmail } });
        if (mgr) {
          user = mgr;
          userRole = mgr.role;
        }
      }
    } else {
      user = await prisma.serviceManager.findUnique({ where: { email: normalizedEmail } });
      // Fallback: in case manager/admin tab was selected but it's a customer account
      if (!user) {
        const cust = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (cust) {
          user = cust;
          userRole = 'CUSTOMER';
        }
      } else {
        userRole = user.role; // MANAGER or ADMIN
      }
    }

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { message: "Account is disabled" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: userRole,
    };
    
    const token = await signToken(payload);

    const response = NextResponse.json(
      { message: "Login successful", user: payload },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
