"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Card } from "./components/Card";
import { PainPoint } from "./components/PainPoint";
import { GlassCard } from "./components/GlassCard";
import { Modal } from "./components/Modal";
import { SolutionModal, Solution } from "./components/SolutionModal";
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
    { text: "You depend only on your contact list", icon: ListX },
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
    {
      title: "Follow-up Support",
      description: "We ensure everything runs smoothly after launch",
      icon: Headset,
    },
  ];

  const solutions: Solution[] = [
    {
      title: "One Simple Business Link",
      pain: [
        "You explain your products over and over again",
        "Customers get confused, ask too many questions, and still say 'I'll get back to you'",
        "There's no one clear place to send people"
      ],
      solution: [
        "We build a single business link that shows everything you sell in a clean, simple way — products, prices, details, and credibility",
        "You can easily upload or update products yourself anytime, without stress or technical headaches"
      ],
      outcome: [
        "Customers can see everything you offer in one place, anytime",
        "You stay in control, update your products when it's convenient, and go on with your day"
      ],
      images: [
        { src: "/products-showcase-1.jpg", alt: "Product showcase example 1" },
        { src: "/products-showcase-2.jpg", alt: "Product showcase example 2" },
        { src: "/products-showcase-3.jpg", alt: "Product showcase example 3" },
        { src: "/products-showcase-4.jpg", alt: "Product showcase example 4" }
      ]
    },
    {
      title: "Consistency System",
      pain: [
        "You want to post and follow up consistently, but life gets busy",
        "You forget, lose motivation, or don't know what to say"
      ],
      solution: [
        "We set up a simple consistency system with ready-made templates for daily status updates, weekly broadcasts, and basic sales tracking"
      ],
      outcome: [
        "Your business stays visible and active without you thinking about what to post every day",
        "Consistency becomes automatic, not stressful"
      ],
      images: [
        { src: "/status-consistency.jpg", alt: "Status consistency system" }
      ]
    },
    {
      title: "Follow-Up System",
      pain: [
        "Customers say 'I'll get back to you' and disappear",
        "You don't know how or when to follow up without sounding pushy"
      ],
      solution: [
        "We provide smart follow-up message templates for order confirmation, delivery updates, reminders, and gentle check-ins — ready to copy and send"
      ],
      outcome: [
        "Customers are reminded at the right time, without pressure",
        "More conversations move forward instead of going cold"
      ],
      images: [
        { src: "/messaging-template.jpg", alt: "Follow-up message templates" }
      ]
    }
  ];

  const processSteps = [
    {
      number: "01",
      title: "Understand your business",
      description:
        "We learn about your products, customers, and what makes your business unique",
      icon: Ear,
    },
    {
      number: "02",
      title: "Organize everything clearly",
      description:
        "We structure your products in a way that's easy to browse and understand",
      icon: Layers,
    },
    {
      number: "03",
      title: "Set up your showcase",
      description:
        "We build your product display with clean design and smooth functionality",
      icon: LayoutGrid,
    },
    {
      number: "04",
      title: "Test and make it smooth",
      description:
        "We ensure everything works perfectly before you start sharing",
      icon: TestTube,
    },
    {
      number: "05",
      title: "Support after launch",
      description:
        "We're here to help with updates, questions, and keeping things running",
      icon: Headset,
    },
  ];

  return (
    <div className="min-h-screen relative z-10">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-4xl px-6 py-15 text-center lg:py-32 fade-in-up">
          <h1
            className="mx-auto mb-6 max-w-3xl text-3xl font-bold sm:text-5xl lg:text-6xl text-shadow-md"
            style={{
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}
          >
            Display everything you sell, <span className="text-gradient-accent">stress-free;</span> in one link.
          </h1>
          <p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl text-shadow-sm"
            style={{ color: 'var(--text-primary)', opacity: 0.95 }}
          >
            Why stress yourself explaining your products to every new customer, when you can just send them one link?
          </p>
          <a
            href="#deliver"
            className="inline-block rounded-full px-8 py-3.5 text-base font-medium transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-xl border btn-press float-animation glow-on-hover"
            style={{
              background: 'var(--glass-bg)',
              borderColor: 'var(--glass-border)',
              color: 'var(--text-primary)',
              boxShadow: '0 4px 24px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            See what we build
          </a>
        </section>

        {/* Section Divider */}
        <div className="section-divider mb-20"></div>

        {/* Pain Points Section */}
        <section className="py-14 lg:py-28 scroll-fade-in">
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
        <div className="section-divider mb-20"></div>

        {/* Solutions Showcase Section */}
        <section className="py-20 lg:py-28 scroll-fade-in">
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
              <div className="grid gap-8 md:grid-cols-3">
                {solutions.map((solution, index) => (
                  <div
                    key={index}
                    className="cursor-pointer transition-all hover:scale-105 p-4 rounded-lg"
                    style={{
                      background: 'var(--card-background-light)',
                      border: '1px solid var(--glass-border)',
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
                      className="mb-4 text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {solution.pain[0]}
                    </p>
                    <button
                      className="text-sm font-medium transition-colors hover:underline"
                      style={{ color: 'var(--highlight)' }}
                    >
                      View solution →
                    </button>
                  </div>
                ))}
              </div>

              <div
                className="mt-8 pt-6 border-t text-center"
                style={{ borderColor: 'var(--glass-border)' }}
              >
                <p
                  className="text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    These are working systems, ready for you.
                  </span>
                  {" "}We're offering special rates for our first 10 clients — built, tested, and customized for your business.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider mb-20"></div>

        {/* Process Section */}
        <section className="py-20 lg:py-28 scroll-fade-in">
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
        <div className="section-divider mb-20"></div>

        {/* Final CTA Section */}
        <section
          id="contact"
          className="pt-15  lg:py-28"
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
              Tired of explaining the same thing over and over?
            </h2>
            <p
              className="mb-10 text-lg leading-relaxed text-shadow-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Let's set up your link so customers can browse everything without bothering you. Just send one link and watch them order on their own time.
            </p>
            <a
              href="https://wa.me/1234567890"
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
              Start a conversation
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
  );
}
