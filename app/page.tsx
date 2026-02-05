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
    { text: "You explain your products over and over again", icon: MessageSquare },
    { text: `Your customers disappear after "I'll get back to you"`, icon: UserX },
    { text: "You don't have one clear place to send customers", icon: MapPinOff },
    { text: "You struggle to post and follow up consistently", icon: CalendarX },
  ];

  const services = [
    {
      title: "One Simple Business Link",
      description: "Share your complete product catalog with a single link",
      icon: Link,
    },
    {
      title: "Clean Product Display",
      description: "Customers see everything clearly without needing to ask you",
      icon: LayoutGrid,
    },
    {
      title: "Trustworthy Presence",
      description: "Customers trust you're real and reachable, not just another scammer",
      icon: Shield,
    },
    {
      title: "WhatsApp Ads Support",
      description: "More people discover your business on WhatsApp",
      icon: Megaphone,
    },
  ];

  const solutions: Solution[] = [
    {
      title: "One Simple Business Link",
      pain: [
        "→ You explain your products over and over again",
        `→ Customers get confused, ask too many questions, and still say "I'll get back to you"`,
        "→ There's no one clear place to send people"
      ],
      solution: [
        "→ We give you a single business link that shows everything you sell in a clean, simple way",
        "→ You can easily upload or update products yourself anytime, without stress or technical headaches"
      ],
      outcome: [
        "→ Customers can see everything you offer in one place, anytime",
        "→ You stay in control, update your products when it's convenient, and go on with your day"
      ],
      images: [
        { src: "/products-showcase-1.jpg", alt: "Online product catalog example for small business in Nigeria showing clean product display" },
        { src: "/products-showcase-2.jpg", alt: "Business website product catalog with easy navigation for Nigerian small businesses" },
        { src: "/products-showcase-3.jpg", alt: "Simple sales system product showcase with prices and descriptions for online selling" },
        { src: "/products-showcase-4.jpg", alt: "Mobile-friendly product catalog website for small business online store" },
        { src: "/product-showcase-5.jpg", alt: "WhatsApp-integrated product catalog for Nigerian small businesses selling online" }
      ]
    },
    {
      title: "Consistency System",
      pain: [
        "→ You want to post consistently, but life gets busy",
        "→ You forget who showed interest, which costs you money"
      ],
      solution: [
        "→ We set up ready-made templates for daily status updates and weekly broadcasts",
        "→ Plus a simple tracker to see every pending customer at a glance"
      ],
      outcome: [
        "→ Your business stays visible without daily stress",
        "→ You never lose track of interested customers",
        "→ Consistency becomes automatic, not a burden"
      ],
      images: [
        { src: "/status-consistency.jpg", alt: "WhatsApp status templates for consistent online selling and business visibility in Nigeria" },
        { src: "/follow-up-tracker.jpg", alt: "Customer follow-up tracking system for small businesses managing sales leads and orders" }
      ]
    },
    {
      title: "Follow-Up System",
      pain: [
        "→ Customers say 'I'll get back to you' and disappear",
        "→ You don't know what to say or when without sounding pushy"
      ],
      solution: [
        "→ Smart message templates for different scenarios — gentle check-ins, order confirmations, delivery updates, reminders",
        "→ Ready to copy and send at the right time"
      ],
      outcome: [
        "→ Conversations keep moving forward",
        "→ Lost customers come back",
        "→ You sound professional, not desperate"
      ],
      images: [
        { src: "/messaging-template.jpg", alt: "Professional WhatsApp message templates for small business customer follow-up and sales communication" }
      ]
    }
  ];

  const solutionCardSubtexts = [
    "Do you go through the stress of explaining your products over and over again, to every new customer?",
    "Do you want to post consistently, but life gets busy?",
    `Do customers say "I'll get back to you", and never get back to you?`
  ];

  const processSteps = [
    {
      number: "01",
      title: "We learn your business",
      description:
        "Tell us about your products, your customers, and what makes you different. We take time to understand what you really need",
      icon: Ear,
    },
    {
      number: "02",
      title: "We build your system",
      description:
        "We organize everything and create a clean, simple showcase where your customers can easily browse and order",
      icon: LayoutGrid,
    },
    {
      number: "03",
      title: "We launch and support",
      description:
        "We make sure everything works smoothly, then stay with you for any updates or questions you have",
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
            <section id="hero" className="mx-auto max-w-4xl px-6 py-15 text-center lg:py-32 fade-in-up" aria-label="Sales systems and product catalogs for small businesses in Nigeria">
              <h1
                className="mx-auto mb-6 max-w-3xl text-3xl font-bold sm:text-5xl lg:text-6xl text-shadow-md"
                style={{
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.35'
                }}
              >
                <span style={{ whiteSpace: 'nowrap' }}>Display everything you sell,</span>
                <br />
                <span className="text-gradient-accent">in one link.</span>
                <span className="sr-only"> - Sales systems and product catalogs for small businesses in Nigeria selling online</span>
              </h1>
              <p
                className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed sm:text-xl text-shadow-sm"
                style={{ color: 'var(--text-primary)', opacity: 0.95 }}
              >
                Why stress yourself explaining your products to every new customer, when you can just send them one link?
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
                View Our Work
              </a>
            </section>

            {/* Section Divider */}
            <div className="section-divider my-24"></div>

            {/* Pain Points Section */}
            <section id="pain-points" className="py-20 lg:py-28 scroll-fade-in" aria-label="Common challenges for Nigerian small businesses selling online with WhatsApp">
              <div className="mx-auto max-w-3xl px-6">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  Sound familiar?
                  <span className="sr-only"> - Challenges Nigerian small businesses face selling online</span>
                </h2>
                <p
                  className="mb-12 text-lg text-shadow-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  These are problems we will help you solve.
                </p>
                <GlassCard className="p-8">
                  <div className="space-y-6">
                    {painPoints.map((point, index) => (
                      <PainPoint key={index} text={point.text} icon={point.icon} />
                    ))}
                  </div>
                </GlassCard>
              </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider my-24"></div>

            {/* What You Get Section */}
            <section id="what-we-build" className="py-20 lg:py-28 scroll-fade-in" aria-label="Sales systems, product catalogs, and websites we build for Nigerian small businesses">
              <div className="mx-auto max-w-7xl px-6">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  What you get
                  <span className="sr-only"> - Complete sales systems and product catalogs for online selling</span>
                </h2>
                <p
                  className="mb-12 max-w-2xl text-lg text-shadow-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Everything you need to stop stressing and start selling with a simple link.
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
            <section id="our-work" className="py-20 lg:py-28 scroll-fade-in" aria-label="Sales systems and website solutions for Nigerian small businesses selling online">
              <div className="mx-auto max-w-6xl px-6">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm text-center"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  View Our Work
                  <span className="sr-only"> - Product catalogs and sales systems for small businesses in Nigeria</span>
                </h2>
                <p
                  className="mb-4 text-lg text-shadow-sm text-center"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  How we remove stress from selling online
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
                        Ready-to-use systems.
                      </span>
                      {" "}Just plug in, customize, and start using. Our first 5 clients get the special pre-launch package!
                    </p>
                  </div>
                </GlassCard>
              </div>
            </section>

            {/* Section Divider */}
            <div className="section-divider my-24"></div>

            {/* Process Section */}
            <section id="how-we-work" className="py-20 lg:py-28 scroll-fade-in" aria-label="Our process for building sales systems and websites for Nigerian small businesses">
              <div className="mx-auto max-w-4xl px-6">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  How we work
                  <span className="sr-only"> - Building product catalogs and sales systems for Nigerian businesses</span>
                </h2>
                <p
                  className="mb-12 text-lg text-shadow-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  A clear process from start to finish.
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
              aria-label="Get started with sales systems and product catalogs for your small business in Nigeria"
            >
              <div className="mx-auto max-w-3xl px-6 text-center">
                <h2
                  className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm"
                  style={{
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    lineHeight: '1.2'
                  }}
                >
                  Selling online shouldn't feel this stressful
                  <span className="sr-only"> - Start selling online with product catalogs and sales systems</span>
                </h2>
                <p
                  className="mb-10 text-lg leading-relaxed text-shadow-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Give your customers one place to see everything you sell. No more wasted time and efforts. Send one link, and watch them order when they're ready.
                </p>
                <a
                  href="https://wa.me/2349040991849?text=Hello%201010%20Web%20Studio%2C%20I%20checked%20your%20website%20and%20I%27d%20like%20to%20discuss%20a%20project."
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
                  Get started now
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
