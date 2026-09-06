import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body || {};
    const inputIdentifier = (email || "").trim();
    const inputPassword = (password || "").trim();
    const rawPassword = password || "";

    if (!inputIdentifier || !rawPassword) {
      return NextResponse.json(
        { message: "User ID (email, phone, or name) and password are required" },
        { status: 400 }
      );
    }

    const isEmail = inputIdentifier.includes("@");
    const lower = inputIdentifier.toLowerCase();
    const inputDigits = inputIdentifier.replace(/\D/g, "");
    const phone10 = inputDigits.length >= 10 ? inputDigits.slice(-10) : (inputDigits.length >= 5 ? inputDigits : "");

    // Fetch accounts from both tables for robust identification
    const [allUsers, allManagers] = await Promise.all([
      prisma.user.findMany(),
      prisma.serviceManager.findMany()
    ]);

    const candidates: any[] = [];

    const checkMatch = (account: any) => {
      const accEmail = (account.email || "").trim().toLowerCase();
      const accPhone = (account.phone || "").trim();
      const accPhoneDigits = accPhone.replace(/\D/g, "");
      const accName = (account.name || "").trim().toLowerCase();
      const accNameParts = accName.split(/\s+/);

      // 1. Email match (exact or username prefix before @)
      if (isEmail && accEmail === lower) return true;
      if (!isEmail && (accEmail === lower || accEmail.split("@")[0] === lower)) return true;

      // 2. Phone match
      if (inputDigits && accPhoneDigits) {
        if (accPhoneDigits === inputDigits) return true;
        if (phone10 && accPhoneDigits.slice(-10) === phone10) return true;
        if (accPhoneDigits.endsWith(inputDigits) || inputDigits.endsWith(accPhoneDigits)) return true;
      }
      if (accPhone && accPhone === inputIdentifier) return true;

      // 3. Name match (full name or first/last name part)
      if (!isEmail && !inputDigits && (accName === lower || accNameParts.includes(lower))) return true;

      return false;
    };

    for (const u of allUsers) {
      if (checkMatch(u)) {
        candidates.push({ ...u, resolvedRole: "CUSTOMER", tableType: "User" });
      }
    }

    for (const m of allManagers) {
      if (checkMatch(m)) {
        candidates.push({ ...m, resolvedRole: m.role || "MANAGER", tableType: "ServiceManager" });
      }
    }

    if (candidates.length === 0) {
      return NextResponse.json(
        { message: "Invalid email/phone or password" },
        { status: 401 }
      );
    }

    // Prioritize candidates matching the selected role in the UI if provided
    const preferredRole = role ? String(role).toUpperCase() : null;
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
      const statusUpper = (candidate.status || "ACTIVE").toUpperCase();
      if (statusUpper !== "ACTIVE") continue;
      
      let isPasswordValid = await bcrypt.compare(inputPassword, candidate.password_hash);
      if (!isPasswordValid && rawPassword !== inputPassword) {
        isPasswordValid = await bcrypt.compare(rawPassword, candidate.password_hash);
      }

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
