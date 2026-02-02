"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function FirstLoadAnimation() {
    const [isVisible, setIsVisible] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Check if animation has already played in this session
        const hasAnimated = sessionStorage.getItem('firstLoadAnimationPlayed');
        const pageContent = document.getElementById('page-content');

        if (hasAnimated) {
            // Animation already played, ensure body is scrollable and content is visible
            document.body.style.overflow = 'auto';
            if (pageContent) {
                pageContent.style.display = 'block';
            }
            return;
        }

        // Hide page content during animation
        if (pageContent) {
            pageContent.style.display = 'none';
        }

        // Show animation and mark as played IMMEDIATELY
        setIsVisible(true);
        sessionStorage.setItem('firstLoadAnimationPlayed', 'true');

        // Lock scrolling during animation
        document.body.style.overflow = 'hidden';

        // Set GSAP defaults
        gsap.defaults({ ease: "power3.out" });

        // Store timeline reference for cleanup
        let tl: gsap.core.Timeline | null = null;

        // Function to animate to corner and fade out
        const animateToCorner = () => {
            if (tl) tl.kill();

            const wrapper = document.querySelector('.animation-wrapper') as HTMLElement;
            const overlay = document.querySelector('.first-load-overlay') as HTMLElement;

            if (wrapper && overlay) {
                // Animate wrapper to top-left corner and scale down
                gsap.to(wrapper, {
                    x: -window.innerWidth / 2 + 40,
                    y: -window.innerHeight / 2 + 40,
                    scale: 0.15,
                    duration: 0.8,
                    ease: "power3.inOut",
                    onComplete: () => {
                        // Fade out the overlay
                        gsap.to(overlay, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                setIsVisible(false);
                                document.body.style.overflow = 'auto';
                            }
                        });
                    }
                });

                // Show page content during animation
                const pageContent = document.getElementById('page-content');
                if (pageContent) {
                    pageContent.style.display = 'block';
                    gsap.from(pageContent, {
                        opacity: 0,
                        duration: 0.5,
                        delay: 0.3
                    });
                }
            }
        };

        // Wait for DOM elements to be rendered before animating
        setTimeout(() => {
            tl = gsap.timeline({
                delay: 0.2,
                onComplete: () => {
                    // Start corner animation
                    setTimeout(() => {
                        animateToCorner();
                    }, 500);
                }
            });

            /* ZERO 1 rolls in */
            tl.to(".z1", {
                x: 180,
                duration: 0.8,
                ease: "elastic.out(1, 0.9)"
            });

            /* ZERO 2 rolls in */
            tl.to(".z2", {
                x: 150,
                duration: 0.6,
                ease: "elastic.out(1, 0.4)"
            }, "-=0.2");

            /* PUSH reaction */
            tl.to(".z1", {
                x: 195,
                scaleX: 0.9,
                duration: 0.3,
                ease: "power2.inOut"
            }, "<")

                // recover shape
                .to(".z1", {
                    scaleX: 1,
                    duration: 0.15,
                    ease: "power2.out"
                });

            /* prepare both 1s */
            tl.set([".o1", ".o1-clone"], {
                opacity: 1,
                y: 0
            });

            /* drop BOTH together */
            tl.to([".o1", ".o1-clone"], {
                y: 190,
                duration: 0.45,
                ease: "power2.in"
            }, "-=0.2")

                /* single bounce up (together) */
                .to([".o1", ".o1-clone"], {
                    y: 155,
                    duration: 0.25,
                    ease: "power2.out"
                })

                /* settle (together) */
                .to([".o1", ".o1-clone"], {
                    y: 190,
                    duration: 0.2,
                    ease: "power2.in"
                })

                /* split AFTER settle */
                .to(".o1-clone", {
                    x: -145,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
        }, 50);

        // Cleanup
        return () => {
            if (tl) tl.kill();
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`first-load-overlay ${isFadingOut ? 'fade-out' : ''}`}
            onClick={() => {
                const wrapper = document.querySelector('.animation-wrapper') as HTMLElement;
                const overlay = document.querySelector('.first-load-overlay') as HTMLElement;

                if (wrapper && overlay) {
                    gsap.to(wrapper, {
                        x: -window.innerWidth / 2 + 60,
                        y: -window.innerHeight / 2 + 40,
                        scale: 0.15,
                        duration: 0.8,
                        ease: "power3.inOut",
                        onComplete: () => {
                            gsap.to(overlay, {
                                opacity: 0,
                                duration: 0.3,
                                onComplete: () => {
                                    setIsVisible(false);
                                    document.body.style.overflow = 'auto';
                                }
                            });
                        }
                    });

                    const pageContent = document.getElementById('page-content');
                    if (pageContent) {
                        pageContent.style.display = 'block';
                        gsap.from(pageContent, {
                            opacity: 0,
                            duration: 0.5,
                            delay: 0.3
                        });
                    }
                }
            }}
            style={{ cursor: 'pointer' }}
        >
            <div className="animation-wrapper">
                <div className="stage">
                    <div className="zero z1"></div>
                    <div className="zero z2"></div>
                    <div className="one o1"></div>
                    <div className="one o1-clone"></div>
                </div>
            </div>

            <style jsx>{`
        .first-load-overlay {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #040d1f 0%, #05132d 50%, #040d1f 100%);
          z-index: 9999;
          overflow: hidden;
          opacity: 1;
        }

        .first-load-overlay.fade-out {
          opacity: 0;
        }

        .animation-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          transform: scale(0.4);
          padding-left: 93px;
          padding-right: 50px;
        }

        .stage {
          position: relative;
          width: 400px;
          height: 150px;
        }

        .zero {
          width: 80px;
          height: 120px;
          border: 12px solid rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          position: absolute;
          top: 15px;
        }

        .z1 {
          left: -120px;
        }

        .z2 {
          left: -220px;
        }

        .one {
          width: 12px;
          height: 110px;
          background: rgba(255, 255, 255, 0.95);
          position: absolute;
          top: -170px;
          left: 40px;
        }

        .o1-clone {
          opacity: 0;
        }
      `}</style>
        </div>
    );
}