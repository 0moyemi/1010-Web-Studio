import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl"
            style={{
                background: 'var(--glass-bg)',
            }}
        >
            <div className="text-center space-y-6">
                <div className="animate-pulse">
                    <Image
                        src="/Primary Logo.svg"
                        alt="1010 Web Studio"
                        width={200}
                        height={80}
                        priority
                    />
                </div>
                <div className="flex justify-center gap-2">
                    <div className="h-3 w-3 rounded-full animate-bounce"
                        style={{
                            background: 'var(--highlight)',
                            animationDelay: '0ms'
                        }}
                    ></div>
                    <div className="h-3 w-3 rounded-full animate-bounce"
                        style={{
                            background: 'var(--highlight)',
                            animationDelay: '150ms'
                        }}
                    ></div>
                    <div className="h-3 w-3 rounded-full animate-bounce"
                        style={{
                            background: 'var(--highlight)',
                            animationDelay: '300ms'
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
