import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected paths
  const isCustomerRoute = pathname.startsWith('/customer');
  const isManagerRoute = pathname.startsWith('/manager') && !pathname.startsWith('/manager/login');
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  if (isCustomerRoute || isManagerRoute || isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const role = payload.role as string;

    // Role-based access control
    if (isCustomerRoute && role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (isManagerRoute && role !== 'MANAGER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/customer/:path*', '/manager/:path*', '/admin/:path*'],
};
