import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body || {};
    const inputIdentifier = (email || "").trim();
    const inputPassword = (password || "");

    if (!inputIdentifier || !inputPassword) {
      return NextResponse.json(
        { message: "User ID (email or mobile) and password are required" },
        { status: 400 }
      );
    }

    const isEmail = inputIdentifier.includes("@");
    const emailLower = inputIdentifier.toLowerCase();
    const digitsOnly = inputIdentifier.replace(/\D/g, "");
    const phone10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

    // Build database search conditions
    const searchConditions: any[] = [];
    if (isEmail) {
      searchConditions.push({ email: emailLower });
    } else {
      searchConditions.push({ phone: inputIdentifier });
      if (phone10) {
        searchConditions.push({ phone: phone10 });
        searchConditions.push({ phone: `+91${phone10}` });
        searchConditions.push({ phone: `91${phone10}` });
        searchConditions.push({ phone: `0${phone10}` });
      }
    }

    // Query Customer table
    const customerMatches = await prisma.user.findMany({
      where: { OR: searchConditions }
    });

    // Query ServiceManager table
    const managerMatches = await prisma.serviceManager.findMany({
      where: { OR: searchConditions }
    });

    // Merge candidate accounts
    const candidates = [
      ...customerMatches.map(u => ({ ...u, resolvedRole: "CUSTOMER", tableType: "User" })),
      ...managerMatches.map(m => ({ ...m, resolvedRole: m.role || "MANAGER", tableType: "ServiceManager" }))
    ];

    if (candidates.length === 0) {
      return NextResponse.json(
        { message: "Invalid email/phone or password" },
        { status: 401 }
      );
    }

    // Prioritize candidates matching the selected role in the UI if provided
    const preferredRole = role ? role.toUpperCase() : null;
    if (preferredRole) {
      candidates.sort((a, b) => {
        if (a.resolvedRole === preferredRole && b.resolvedRole !== preferredRole) return -1;
        if (b.resolvedRole === preferredRole && a.resolvedRole !== preferredRole) return 1;
        return 0;
      });
    }

    // Find the candidate account where password hash matches
    let authenticatedUser: any = null;
    for (const candidate of candidates) {
      if (candidate.status !== "ACTIVE") continue;
      
      const isPasswordValid = await bcrypt.compare(inputPassword, candidate.password_hash);
      if (isPasswordValid) {
        authenticatedUser = candidate;
        break;
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { message: "Invalid credentials. Please check your password." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const payload = {
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.resolvedRole,
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
