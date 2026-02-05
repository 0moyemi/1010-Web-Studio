import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host')

    // Redirect non-www to www
    if (hostname === '1010web.studio') {
        return NextResponse.redirect(
            `https://www.1010web.studio${request.nextUrl.pathname}${request.nextUrl.search}`,
            { status: 308 } // 308 = Permanent redirect that preserves method
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/:path*',
}
