interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
    return (
        <div
            className={`rounded-2xl border backdrop-blur-xl glass-noise shimmer glow-on-hover ${className}`}
            style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                boxShadow: '0 8px 32px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
        >
            {children}
        </div>
    );
}
