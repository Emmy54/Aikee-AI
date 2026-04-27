import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../constants/theme";

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 1,
      icon: "✏️",
      title: "AI-Powered Guidance",
      description:
        "Get intelligent suggestions powered by Gemini AI to enhance your resume content.",
    },
    {
      id: 2,
      icon: "📋",
      title: "Professional Templates",
      description:
        "Choose from 15+ carefully designed templates for students, creatives, and professionals.",
    },
    {
      id: 3,
      icon: "📸",
      title: "Headshot Generator",
      description:
        "Generate professional headshots using AI-powered image synthesis.",
    },
    {
      id: 4,
      icon: "📊",
      title: "Real-Time Preview",
      description:
        "See your resume update instantly as you make changes with live preview.",
    },
  ];

  const responsiveCss = `
    @media (max-width: 768px) {
      .lp-hero-title {
        font-size: 1.75rem !important;
        line-height: 1.2 !important;
      }
      .lp-hero-subtitle {
        font-size: 0.875rem !important;
      }
      .lp-hero-buttons {
        flex-direction: column !important;
      }
      .lp-hero-button {
        width: 100% !important;
        padding: 0.875rem 1.5rem !important;
        font-size: 0.875rem !important;
      }
      .lp-features-title {
        font-size: 1.75rem !important;
      }
      .lp-features-subtitle {
        font-size: 0.875rem !important;
      }
      .lp-feature-card {
        padding: 1.5rem !important;
      }
      .lp-stats-number {
        font-size: 1.5rem !important;
      }
      .lp-cta-title {
        font-size: 1.75rem !important;
      }
      .lp-cta-button {
        padding: 0.875rem 1.5rem !important;
        font-size: 0.875rem !important;
      }
    }
    @media (max-width: 640px) {
      .lp-hero-title {
        font-size: 1.5rem !important;
        line-height: 1.2 !important;
      }
      .lp-hero-subtitle {
        font-size: 0.8125rem !important;
        line-height: 1.5 !important;
      }
      .lp-nav-header {
        font-size: 1rem !important;
      }
      .lp-features-grid {
        gap: 1rem !important;
      }
      .lp-stats-grid {
        gap: 1.5rem !important;
      }
    }
  `;

  return (
    <div
      style={{ backgroundColor: colors.surface, color: colors.onSurface }}
      className="min-h-screen flex flex-col font-sans"
    >
      <style>{responsiveCss}</style>
      {/* NAVBAR */}
      <header
        style={{
          backdropFilter: "blur(12px)",
          backgroundColor: `rgba(249, 249, 255, 0.8)`,
          borderBottom: `1px solid ${colors.surfaceContainerHighest}`,
        }}
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-3 md:py-5"
      >
        <h1
          style={{
            fontFamily: "'Manrope', sans-serif",
            color: colors.primary,
            letterSpacing: "-0.02em",
          }}
          className="lp-nav-header text-2xl md:text-3xl font-bold"
        >
          NexHire
        </h1>

        <nav className="hidden sm:flex gap-4 md:gap-8 text-xs sm:text-sm font-medium">
          <a
            href="#features"
            style={{ color: colors.onSurfaceVariant }}
            className="hover:text-opacity-100 transition-colors"
          >
            Features
          </a>
          <a
            href="#templates"
            style={{ color: colors.onSurfaceVariant }}
            className="hover:text-opacity-100 transition-colors"
          >
            Templates
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/signin")}
            style={{
              color: colors.primary,
              fontSize: "0.75rem",
              fontWeight: "500",
            }}
            className="hidden sm:block px-3 sm:px-4 py-2 transition-opacity hover:opacity-75"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signin")}
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`,
              color: colors.onPrimary,
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
            className="px-5 py-2 transition-transform hover:scale-105"
          >
            Start Building
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          background: `linear-gradient(180deg, ${colors.surface} 0%, ${colors.surfaceContainerLow} 100%)`,
        }}
        className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 px-4 sm:px-6 md:px-12 py-12 sm:py-20 md:py-32 items-center"
      >
        <div className="space-y-8">
          <div>
            <span
              style={{
                backgroundColor: colors.surfaceContainerHigh,
                color: colors.primary,
                padding: "0.375rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.7rem",
                fontWeight: "600",
                letterSpacing: "0.05em",
              }}
              className="inline-block"
            >
              BUILT FOR STUDENTS & PROFESSIONALS
            </span>

            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "3rem",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginTop: "1.5rem",
              }}
              className="lp-hero-title md:text-5xl font-bold"
            >
              Your Resume, <br />
              <span style={{ color: colors.primaryContainer }}>Perfected</span>
            </h2>

            <p
              style={{
                color: colors.onSurfaceVariant,
                fontSize: "1rem",
                lineHeight: 1.6,
                marginTop: "1.5rem",
              }}
              className="lp-hero-subtitle max-w-md"
            >
              Craft a standout resume with AI-powered guidance, professional
              templates, and instant export. From students to career switchers,
              we've got you covered.
            </p>
          </div>

          <div className="lp-hero-buttons flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => navigate("/signin")}
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`,
                color: colors.onPrimary,
                borderRadius: "0.75rem",
                padding: "1rem 2rem",
                fontSize: "1rem",
                fontWeight: "500",
              }}
              className="lp-hero-button transition-transform hover:scale-105"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/signin")}
              style={{
                backgroundColor: colors.surfaceContainerHigh,
                color: colors.onSurface,
                borderRadius: "0.75rem",
                padding: "1rem 2rem",
                fontSize: "1rem",
                fontWeight: "500",
              }}
              className="lp-hero-button transition-opacity hover:opacity-75"
            >
              Explore Templates
            </button>
          </div>
        </div>

        {/* Hero Illustration Area */}
        <div className="relative hidden md:block">
          <div
            style={{
              backgroundColor: colors.surfaceContainerLowest,
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: `0 64px 64px -16px rgba(0, 23, 75, 0.08)`,
            }}
            className="aspect-square flex items-center justify-center"
          >
            <div
              style={{
                backgroundColor: colors.surfaceContainerHigh,
                borderRadius: "0.75rem",
                padding: "1.5rem",
                textAlign: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                📄
              </div>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: colors.primary,
                  marginBottom: "0.5rem",
                }}
              >
                AI-POWERED ENHANCEMENT
              </p>
              <p
                style={{
                  color: colors.onSurfaceVariant,
                  fontSize: "0.875rem",
                }}
              >
                Real-time content suggestions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        style={{ backgroundColor: colors.surface }}
        className="px-6 md:px-12 py-20 md:py-32"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h3
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "2.25rem",
                letterSpacing: "-0.02em",
              }}
              className="lp-features-title font-bold"
            >
              Everything You Need
            </h3>
            <p
              style={{
                color: colors.onSurfaceVariant,
                fontSize: "1rem",
                marginTop: "1rem",
              }}
              className="lp-features-subtitle max-w-lg mx-auto"
            >
              Build, customize, and export a professional resume in minutes.
            </p>
          </div>

          <div className="lp-features-grid grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  borderRadius: "1rem",
                  padding: "2rem",
                  transition: "all 0.3s ease",
                  outline:
                    hoveredFeature === feature.id
                      ? `2px solid ${colors.primary}`
                      : `1px solid ${colors.surfaceContainerHighest}`,
                  outlineOffset: "-1px",
                }}
                className="lp-feature-card"
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                  {feature.icon}
                </div>
                <h4
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    letterSpacing: "-0.01em",
                  }}
                  className="mb-2"
                >
                  {feature.title}
                </h4>
                <p
                  style={{
                    color: colors.onSurfaceVariant,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / STATS */}
      <section
        style={{ backgroundColor: colors.surfaceContainerLow }}
        className="px-6 md:px-12 py-16 md:py-20"
      >
        <div className="lp-stats-grid max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "2rem",
                fontWeight: "700",
                color: colors.primary,
              }}
              className="lp-stats-number mb-2"
            >
              10K+
            </div>
            <p
              style={{
                color: colors.onSurfaceVariant,
                fontSize: "0.95rem",
              }}
            >
              Resumes Built
            </p>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "2rem",
                fontWeight: "700",
                color: colors.primaryContainer,
              }}
              className="lp-stats-number mb-2"
            >
              15+
            </div>
            <p
              style={{
                color: colors.onSurfaceVariant,
                fontSize: "0.95rem",
              }}
            >
              Professional Templates
            </p>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "2rem",
                fontWeight: "700",
                color: colors.tertiary,
              }}
              className="lp-stats-number mb-2"
            >
              100%
            </div>
            <p
              style={{
                color: colors.onSurfaceVariant,
                fontSize: "0.95rem",
              }}
            >
              Free to Use
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primaryContainer}15)`,
        }}
        className="px-6 md:px-12 py-20 md:py-28 text-center"
      >
        <h3
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "2.25rem",
            letterSpacing: "-0.02em",
          }}
          className="lp-cta-title font-bold mb-4"
        >
          Ready to Build Your Resume?
        </h3>
        <p
          style={{
            color: colors.onSurfaceVariant,
            fontSize: "1rem",
            marginBottom: "2rem",
          }}
          className="max-w-lg mx-auto"
        >
          Join thousands of job seekers and students creating stunning resumes
          with CV Builder AI.
        </p>

        <button
          onClick={() => navigate("/signin")}
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryContainer})`,
            color: colors.onPrimary,
            borderRadius: "0.75rem",
            padding: "1rem 2rem",
            fontSize: "1rem",
            fontWeight: "500",
          }}
          className="lp-cta-button transition-transform hover:scale-105"
        >
          Create My Resume Now
        </button>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: colors.surfaceContainerLow,
          borderTop: `1px solid ${colors.surfaceContainerHighest}`,
        }}
        className="px-6 md:px-12 py-8 md:py-10 text-sm"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p style={{ color: colors.onSurfaceVariant }}>
            © 2024 CV Builder AI. Crafted for your success.
          </p>
          <div className="flex gap-8" style={{ color: colors.onSurfaceVariant }}>
            <a href="#" className="hover:text-opacity-100 transition-opacity">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-opacity-100 transition-opacity">
              Terms
            </a>
            <a href="#" className="hover:text-opacity-100 transition-opacity">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
