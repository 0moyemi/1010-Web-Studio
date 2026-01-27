"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { Card } from "./components/Card";
import { PainPoint } from "./components/PainPoint";
import { GlassCard } from "./components/GlassCard";
import { Modal } from "./components/Modal";
import { ShieldAlert, TrendingDown, ImageOff, Store, Code, ShieldCheck, Rocket, TrendingUp, Ear, Wrench, Headset } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    { text: "Customers don't trust online sellers", icon: ShieldAlert },
    { text: "WhatsApp chats don't scale", icon: TrendingDown },
    { text: "Hard to showcase products clearly", icon: ImageOff },
    { text: "Business looks less professional online", icon: Store },
  ];

  const services = [
    {
      title: "Web Development",
      description: "Custom websites built to convert visitors into customers",
      icon: Code,
    },
    {
      title: "Security",
      description: "SSL certificates and secure hosting to build trust",
      icon: ShieldCheck,
    },
    {
      title: "SEO & Performance",
      description: "Fast loading and Google-friendly sites that get found",
      icon: Rocket,
    },
    {
      title: "Marketing Support",
      description: "Analytics and tools to understand your audience",
      icon: TrendingUp,
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Understand your business",
      description:
        "We listen to your goals, audience, and challenges before touching any code",
      icon: Ear,
    },
    {
      number: "02",
      title: "Build & optimize",
      description:
        "Clean design, fast performance, and mobile-first development",
      icon: Wrench,
    },
    {
      number: "03",
      title: "Secure & launch",
      description:
        "SSL setup, testing, and a smooth launch with zero downtime",
      icon: Rocket,
    },
    {
      number: "04",
      title: "Support & growth",
      description:
        "Ongoing updates, monitoring, and help whenever you need it",
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
            Your business is <span className="text-gradient-accent">fire</span>,
            <br />
            our service is the <span className="text-gradient-accent">fuel</span>.
          </h1>
          <p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl text-shadow-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            We design and build professional websites that make selling and
            marketing easier for small businesses.
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
              These are problems we help solve every day.
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

        {/* What We Deliver Section */}
        <section id="deliver" className="py-20 lg:py-28 scroll-fade-in">
          <div className="mx-auto max-w-7xl px-6">
            <h2
              className="mb-4 text-3xl font-bold sm:text-4xl text-shadow-sm"
              style={{
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: '1.2'
              }}
            >
              What we deliver
            </h2>
            <p
              className="mb-12 max-w-2xl text-lg text-shadow-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Everything you need to build trust and grow your business online.
            </p>
            {/* Horizontal scroll container */}
            <div className="hide-scrollbar -mx-6 flex gap-6 overflow-x-auto px-6 py-8 pb-4 snap-x snap-mandatory">
              {services.map((service, index) => (
                <Card
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  className="w-80 snap-center"
                  enableScrollScale={true}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="section-divider mb-20"></div>

        {/* Proof Section */}
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
              Built for real businesses
            </h2>
            <p
              className="mb-12 text-lg text-shadow-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              See how we help companies grow with professional websites.
            </p>

            <GlassCard className="p-8 mb-8">
              <h3
                className="mb-3 text-2xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                Artisan Bakery Co.
              </h3>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                A clean, modern website with online ordering, product gallery,
                and integrated analytics. Helped increase online orders by 40%
                in the first month.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-base font-medium transition-colors hover:underline"
                style={{ color: 'var(--highlight)' }}
              >
                View case study →
              </button>
            </GlassCard>

            <div
              className="rounded-xl p-6 border backdrop-blur-xl"
              style={{
                background: 'var(--glass-bg)',
                borderColor: 'var(--glass-border)',
                boxShadow: '0 4px 16px var(--glass-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <p
                className="text-center text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span
                  className="font-semibold"
                  style={{ color: 'var(--highlight)' }}
                >
                  Founding Client Discount:
                </span>{" "}
                We're offering special rates for our first 10 clients. Build trust with a professional online presence.
              </p>
            </div>
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
              Ready to build something professional?
            </h2>
            <p
              className="mb-10 text-lg leading-relaxed text-shadow-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Let's talk about your business and see if we're a good fit. No
              pressure, no sales pitch—just an honest conversation.
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

      {/* Footer */}
      <footer
        className="border-t py-12 mt-20 backdrop-blur-xl"
        style={{
          borderColor: 'var(--glass-border)',
          background: 'var(--glass-bg)',
          boxShadow: 'inset 0 1px 0 var(--glass-glow)'
        }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p
            className="mb-2 text-lg font-semibold text-shadow-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            1010 Web Studio
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            © 2026 · Built with care by 1010 Web Studio
          </p>
        </div>
      </footer>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-8">
          <h3
            className="mb-4 text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Case Study: Artisan Bakery Co.
          </h3>
          <div className="space-y-4">
            <p style={{ color: 'var(--text-secondary)' }}>
              <strong>Challenge:</strong> The bakery relied on phone orders and had no online presence.
              Customers couldn't browse products or place orders outside business hours.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              <strong>Solution:</strong> We built a modern, mobile-first website with a product gallery,
              online ordering system, and integrated payment processing.
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              <strong>Results:</strong> 40% increase in orders within the first month, with 60% of new
              customers finding them through Google search. The owner now spends less time on the phone
              and more time baking.
            </p>
            <div
              className="mt-6 rounded-lg p-4"
              style={{ backgroundColor: 'var(--card-background-light)' }}
            >
              <p
                className="text-sm italic"
                style={{ color: 'var(--text-secondary)' }}
              >
                "1010 Web Studio understood exactly what we needed. The website pays for itself every week."
              </p>
              <p
                className="mt-2 text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                — Sarah M., Owner
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
