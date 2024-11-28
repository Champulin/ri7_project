import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get the access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    console.log('Access token in middleware:', accessToken); // Debugging

    // Redirect to login if no access token is present
    if (!accessToken && request.nextUrl.pathname.startsWith('/dashboard')) {
        console.log('No access token, redirecting to login...');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Protect all routes under /dashboard
export const config = {
    matcher: ['/dashboard/:path*'],
};
