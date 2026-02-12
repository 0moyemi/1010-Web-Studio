"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Card } from "./components/Card";
import { PainPoint } from "./components/PainPoint";
import { GlassCard } from "./components/GlassCard";
import { Modal } from "./components/Modal";
import { SolutionModal, Solution } from "./components/SolutionModal";
import FirstLoadAnimation from "./components/FirstLoadAnimation";
import { MessageSquare, UserX, ListX, CalendarX, MapPinOff, Link, LayoutGrid, Shield, Megaphone, Ear, Layers, TestTube, Rocket, Headset } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = document.querySelectorAll(".scroll-fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const painPoints = [
    { text: "You type the same product details 20 times a day", icon: MessageSquare },
    { text: `Customers say "I'll get back to you", and disappear`, icon: UserX },
    { text: "New customers don't trust small pages", icon: Shield },
    { text: "Serious buyers get tired and leave", icon: UserX },
  ];

  const services = [
    {
      title: "Customers Stop Asking Too Many Questions",
      description: "They see your prices, sizes, and photos clearly.",
      icon: MessageSquare,
    },
    {
      title: "Serious Buyers Buy Faster",
      description: "No more long explanations before someone pays.",
      icon: Rocket,
    },
    {
      title: "You Look Like a Big Brand",
      description: "Even if you're a small fashion business in Nigeria.",
      icon: Shield,
    },
    {
      title: "You Stop Wasting Time",
      description: "Send one link. That's it.",
      icon: Link,
    },
  ];

  const solutions: Solution[] = [
    {
      title: "Your WhatsApp Store",
      pain: [
        "→ You type product details over and over, and people still ask for prices, sizes, colors",
        `→ New customers don't trust you because your page looks small and unprofessional`
      ],
      solution: [
        "→ We build you one clean page showing all your clothes with prices, sizes, and clear photos",
        "→ You can add or change products anytime yourself — no technical stress"
      ],
      outcome: [
        "→ Customers browse your full collection and buy without asking you anything",
        "→ You look like a real brand, even as a small fashion business"
      ],
      images: [
        { src: "/products-showcase-1.jpg", alt: "WhatsApp store for Nigerian fashion brand showing dresses with prices and sizes" },
        { src: "/products-showcase-2.jpg", alt: "Online fashion catalog for WhatsApp business Nigeria - clean product display" },
        { src: "/products-showcase-3.jpg", alt: "Fashion store page for selling clothes on WhatsApp Nigeria" },
        { src: "/products-showcase-4.jpg", alt: "Mobile-friendly fashion catalog for Nigerian fashion brands on WhatsApp" },
        { src: "/product-showcase-5.jpg", alt: "WhatsApp business store for selling fashion in Nigeria" }
      ]
    },
    {
      title: "Stay Visible",
      pain: [
        "→ You want to post every day but life gets busy",
        "→ You forget which customers said they'd come back"
      ],
      solution: [
        "→ We give you pre-written status updates and broadcast messages for your fashion business",
        "→ Plus automatic reminders so you never forget to post or follow up"
      ],
      outcome: [
        "→ You stay visible without the stress of thinking how to keep in touch",
        "→ Lost customers come back because you reach out at the right time"
      ],
      images: [
        { src: "/status-consistency.jpg", alt: "WhatsApp status templates for Nigerian fashion brands selling clothes" },
        { src: "/follow-up-tracker.jpg", alt: "Customer follow-up tracker for fashion businesses on WhatsApp Nigeria" }
      ]
    },
    {
      title: "Ready-Made Messages",
      pain: [
        "→ Customers disappear after showing interest",
        "→ You don't know how to follow up without sounding desperate. Or, other times you simply forget"
      ],
      solution: [
        "→ Click the customer's name, pick a template, and it opens directly in their WhatsApp chat",
        "→ Professional messages for every situation — check-ins, order updates, gentle reminders"
      ],
      outcome: [
        "→ No more forgetting customers. No more thinking what to say. Just click and send.",
        "→ Customers who disappeared come back and buy"
      ],
      images: [
        { src: "/messaging-template.jpg", alt: "WhatsApp message templates for Nigerian fashion brands to follow up with customers" }
      ]
    }
  ];

  const solutionCardSubtexts = [
    "Tired of explaining prices and sizes to every single person who asks?",
    "Want to remain consistent but find it difficult?",
    `People say "I'll think about it" and disappear forever?`
  ];

  const processSteps = [
    {
      number: "01",
      title: "We learn about your business",
      description:
        "Tell us what you sell and how you're currently selling on WhatsApp.",
      icon: Ear,
    },
    {
      number: "02",
      title: "We build your store",
      description:
        "We create a clean, simple page where your customers can easily see and order your products.",
      icon: LayoutGrid,
    },
    {
      number: "03",
      title: "Sales gets easier",
      description:
        "Share your link on WhatsApp and watch customers buy easier. We're here if you need any help.",
      icon: Rocket,
    },
  ];

  return (
    <>
      <FirstLoadAnimation />
      <div id="page-content">
        <div className="min-h-screen relative z-10">
          <Header />

          <main>
            {/* Hero Section */}
            <section id="hero" className="mx-auto max-w-4xl px-6 py-15 text-center lg:py-32 fade-in-up" aria-label="WhatsApp store setup for fashion brands in Nigeria - sell clothes easier online">
              <h1
                className="mx-auto mb-6 max-w-3xl text-4xl font-bold sm:text-5xl lg:text-6xl text-shadow-md"
                style={{
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.35'
                }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>Stop Losing Sales</span>
                <br />
                <span className="text-gradient-accent">on WhatsApp.</span>
                <span className="sr-only"> - WhatsApp store setup for Nigerian fashion brands selling clothes online</span>
              </h1>
              <p
                className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed sm:text-xl text-shadow-sm"
                style={{ color: 'var(--text-primary)', opacity: 0.95 }}
              >
                Your customers leave because buying is stressful. We make it easy.
              </p>
              <a
                href="#our-work"
                className="inline-block rounded-full px-8 py-3.5 text-base font-medium transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-xl border btn-press float-animation glow-on-hover"
                style={{
                  background: 'var(--glass-bg)',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 4px 24px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
              >
                See How It Works
              </a>
            </section>

            {/* Section Divider */}
            <div className="section-divider my-24"></div>

            {/* Pain Points Section */}
            <section id="pain-points" className="py-20 lg:py-28 scroll-fade-in" aria-label="Why Nigerian fashion stores lose sales on WhatsApp - common challenges selling clothes online">
              <div className="mx-auto max-w-3xl px-6">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  Why Your Fashion Store Is Losing Sales on WhatsApp
                  <span className="sr-only"> - Problems Nigerian fashion brands face selling clothes on WhatsApp</span>
                </h2>
                <p
                  className="mb-12 text-lg text-shadow-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  If this sounds like you, you're losing money every single day!
                </p>
                <GlassCard className="p-8">
                  <div className="space-y-6">
                    {painPoints.map((point, index) => (
                      <PainPoint key={index} text={point.text} icon={point.icon} />
                    ))}
                    {/* <p
                      className="mt-8 pt-6 border-t text-center text-lg font-semibold"
                      style={{ borderColor: 'var(--glass-border)', color: 'var(--highlight)' }}
                    >
                      Every day this continues, you're losing money.
                    </p> */}
                  </div>
                </GlassCard>
              </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider my-24"></div>

            {/* What You Get Section */}
            <section id="what-we-build" className="py-20 lg:py-28 scroll-fade-in" aria-label="What changes after we build your WhatsApp store for your fashion brand in Nigeria">
              <div className="mx-auto max-w-7xl px-6">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  What Changes After We Build Your Store
                  <span className="sr-only"> - How your WhatsApp fashion store changes after we help you</span>
                </h2>
                <p
                  className="mb-12 max-w-2xl text-lg text-shadow-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Everything gets easier. Easier sales, less stress.
                </p>
                {/* Horizontal scroll container */}
                <div className="scroll-cards-container hide-scrollbar flex gap-5 overflow-x-auto pl-6 pr-6 py-8 pb-4 snap-x snap-mandatory">
                  {services.map((service, index) => (
                    <Card
                      key={index}
                      title={service.title}
                      description={service.description}
                      icon={service.icon}
                      className="w-72 flex-shrink-0 snap-center !p-5"
                      enableScrollScale={true}
                    />
                  ))}
                  {/* Spacer for better end scroll */}
                  <div className="w-6 flex-shrink-0"></div>
                </div>
              </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider my-24"></div>

            {/* Solutions Showcase Section */}
            <section id="our-work" className="py-20 lg:py-28 scroll-fade-in" aria-label="WhatsApp store solutions for Nigerian fashion brands selling clothes online">
              <div className="mx-auto max-w-6xl px-6">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm text-center"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  See How We Help Fashion Brands
                  <span className="sr-only"> - WhatsApp store setups for Nigerian fashion businesses</span>
                </h2>
                <p
                  className="mb-4 text-lg text-shadow-sm text-center"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Real solutions that get you more sales and less stress
                </p>
                <p
                  className="mb-12 text-sm text-center italic"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Click any solution to see the full details and screenshots
                </p>

                <GlassCard className="p-8">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {solutions.map((solution, index) => (
                      <div
                        key={index}
                        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] p-6 rounded-2xl border-l-4 group"
                        style={{
                          background: 'var(--card-background-light)',
                          border: '1px solid var(--glass-border)',
                          borderLeftColor: 'var(--highlight)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        }}
                        onClick={() => setSelectedSolution(solution)}
                      >
                        <h3
                          className="mb-3 text-lg font-semibold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {solution.title}
                        </h3>
                        <p
                          className="mb-5 text-sm leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {solutionCardSubtexts[index]}
                        </p>
                        <div
                          className="inline-flex items-center text-sm font-medium transition-all rounded-md px-3 py-1.5 group-hover:bg-white/10"
                          style={{ color: 'var(--highlight)' }}
                        >
                          View solution →
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className="mt-8 pt-6 border-t text-center"
                    style={{ borderColor: 'var(--glass-border)' }}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Simple and ready to use.
                      </span>
                      {" "}Just share your link and start getting sales.
                    </p>
                    <p
                      className="mt-3 text-sm font-medium"
                      style={{ color: 'var(--highlight)' }}
                    >
                      ⚡ Special package for our first 5 fashion brands
                    </p>
                  </div>
                </GlassCard>
              </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider my-24"></div>

            {/* Process Section */}
            <section id="how-we-work" className="py-20 lg:py-28 scroll-fade-in" aria-label="How we build WhatsApp stores for Nigerian fashion brands">
              <div className="mx-auto max-w-4xl px-6">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  How it works
                  <span className="sr-only"> - Setting up your WhatsApp fashion store</span>
                </h2>
                <p
                  className="mb-12 text-lg text-shadow-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Three simple steps to start selling easier.
                </p>
                <GlassCard className="p-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {processSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="space-y-2">
                          <div
                            className="text-sm font-medium"
                            style={{ color: 'var(--highlight)' }}
                          >
                            {step.number}
                          </div>
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-lg icon-hover-bounce transition-transform"
                            style={{
                              background: 'linear-gradient(135deg, var(--card-background-light) 0%, var(--highlight) 100%)',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                            }}
                          >
                            <Icon size={24} color="white" strokeWidth={2} />
                          </div>
                          <h3
                            className="text-lg font-semibold"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {step.title}
                          </h3>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {step.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider my-24"></div>

            {/* Final CTA Section */}
            <section
              id="get-started"
              className="pt-15  lg:py-28"
              aria-label="Start selling clothes easier on WhatsApp - get your fashion store link today"
            >
              <div className="mx-auto max-w-3xl px-6 text-center">
                <h2
                  className="mb-6 text-3xl font-bold sm:text-4xl text-shadow-sm"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.35'
                  }}
                >
                  Stop Losing Customers.
                  <span className="sr-only"> - Get your WhatsApp store link for your Nigerian fashion brand</span>
                </h2>
                <p
                  className="mb-10 text-lg leading-relaxed text-shadow-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Give them one link and watch them buy.
                </p>
                <a
                  href="https://wa.me/2349040991849?text=Hello%201010%20Web%20Studio%2C%20I%20want%20to%20stop%20losing%20sales%20on%20WhatsApp.%20Let%27s%20build%20my%20link."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full px-8 py-3.5 text-base font-medium transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-xl border btn-press"
                  style={{
                    background: 'var(--glass-bg)',
                    borderColor: 'var(--glass-border)',
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 24px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Build My Link Now
                </a>
              </div>
            </section>
          </main>

          <Footer />

          {/* Solution Modal */}
          <SolutionModal
            isOpen={selectedSolution !== null}
            onClose={() => setSelectedSolution(null)}
            solution={selectedSolution}
          />
        </div>
      </div>
    </>
  );
}
