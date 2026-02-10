import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    // Redirect logic removed - handled by Vercel
    return NextResponse.next()
}

export const config = {
    matcher: '/:path*',
}
