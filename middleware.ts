// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;

  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/admin/manage-users')) {
    if (!token) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    try {
      const decoded: any = verify(token, process.env.JWT_SECRET!);
      if (decoded.role !== 'superadmin') {
        url.pathname = '/admin/unauthorized';
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/manage-users'],
};
