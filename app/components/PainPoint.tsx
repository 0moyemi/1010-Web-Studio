interface PainPointProps {
    text: string;
}

export function PainPoint({ text }: PainPointProps) {
    return (
        <div className="flex items-start gap-4">
            <div
                className="mt-1.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                    background: 'linear-gradient(135deg, var(--card-background-light) 0%, var(--highlight) 100%)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
            >
                {/* Icon placeholder */}
                <div
                    className="h-4 w-4 rounded-full"
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                    }}
                />
            </div>
            <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
            >
                {text}
            </p>
        </div>
    );
}
