import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body || {};
    const inputIdentifier = (email || "").trim();
    const normalizedEmail = inputIdentifier.toLowerCase();

    if (!inputIdentifier || !password) {
      return NextResponse.json(
        { message: "User ID (email or mobile) and password are required" },
        { status: 400 }
      );
    }

    let user: any = null;
    let userRole = role || 'CUSTOMER';

    // Helper to find in Customer table by email or phone
    const findCustomer = async (identifier: string) => {
      return await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier.toLowerCase() },
            { phone: identifier }
          ]
        }
      });
    };

    // Helper to find in ServiceManager table by email or phone
    const findManager = async (identifier: string) => {
      return await prisma.serviceManager.findFirst({
        where: {
          OR: [
            { email: identifier.toLowerCase() },
            { phone: identifier }
          ]
        }
      });
    };

    if (userRole === 'CUSTOMER') {
      user = await findCustomer(inputIdentifier);
      // Fallback: in case customer tab was selected but it's a manager/admin account
      if (!user) {
        const mgr = await findManager(inputIdentifier);
        if (mgr) {
          user = mgr;
          userRole = mgr.role;
        }
      }
    } else {
      user = await findManager(inputIdentifier);
      // Fallback: in case manager/admin tab was selected but it's a customer account
      if (!user) {
        const cust = await findCustomer(inputIdentifier);
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
        { message: "Invalid email/phone or password" },
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
      { message: "Login successful", user: payload, token },
      { status: 200 }
    );

    // Set cookie: only secure if on HTTPS
    const isHttps = req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: isHttps,
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
