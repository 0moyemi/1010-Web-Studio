import { LucideIcon } from "lucide-react";

interface PainPointProps {
    text: string;
    icon?: LucideIcon;
}

export function PainPoint({ text, icon: Icon }: PainPointProps) {
    return (
        <div className="flex items-start gap-4">
            <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg icon-hover-bounce transition-transform"
                style={{
                    background: 'linear-gradient(135deg, var(--card-background-light) 0%, var(--highlight) 100%)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
            >
                {Icon && <Icon size={24} color="white" strokeWidth={2} />}
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
