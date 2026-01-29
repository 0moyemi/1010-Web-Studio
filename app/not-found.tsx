import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center space-y-8 max-w-lg">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/Primary Logo.svg"
                        alt="1010 Web Studio"
                        width={180}
                        height={60}
                        priority
                    />
                </div>
                <h1
                    className="text-6xl font-bold text-shadow-md"
                    style={{
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em'
                    }}
                >
                    404
                </h1>
                <h2
                    className="text-2xl font-semibold text-shadow-sm"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Page not found
                </h2>
                <p
                    className="text-lg"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block rounded-full px-8 py-3.5 text-base font-medium transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-xl border btn-press"
                    style={{
                        background: 'var(--glass-bg)',
                        borderColor: 'var(--glass-border)',
                        color: 'var(--text-primary)',
                        boxShadow: '0 4px 24px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}
