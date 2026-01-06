'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Zap, Shield } from 'lucide-react';
import PricingTiers from '@/components/PricingTiers';

// Dynamic import for 3D scene to avoid SSR issues
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 gradient-bg" />,
});

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Research',
    description: 'Mistral AI analyzes profiles and websites to find key insights in seconds.',
    gradient: 'from-[var(--neon-blue)] to-[var(--neon-purple)]',
  },
  {
    icon: Target,
    title: 'Personalized Starters',
    description: 'Get 5 conversation openers tailored to each prospect.',
    gradient: 'from-[var(--neon-purple)] to-[var(--neon-pink)]',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Save 10+ hours per week on manual research.',
    gradient: 'from-[var(--neon-pink)] to-[var(--neon-blue)]',
  },
  {
    icon: Shield,
    title: 'Pain Points & Gaps',
    description: 'Identify challenges and opportunities others miss.',
    gradient: 'from-[var(--neon-green)] to-[var(--neon-blue)]',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen gradient-bg grid-pattern relative">
      <Scene3D />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">LeadGen AI</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/dashboard"
              className="btn-secondary text-sm py-2 px-4"
            >
              Dashboard
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm py-2 px-4">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse" />
              <span className="text-sm text-[var(--text-secondary)]">
                Powered by Mistral AI
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Turn Any Profile Into
              <br />
              <span className="neon-text">Sales Conversations</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Paste a LinkedIn URL or upload a PDF. Get 5 personalized conversation
              starters, pain points, and market gaps in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                >
                  Try Free Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <a href="#pricing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  View Pricing
                </motion.button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-8 mt-16"
          >
            {[
              { value: '10+', label: 'Hours Saved/Week' },
              { value: '5x', label: 'Response Rate' },
              { value: '₹499', label: 'Starting Price' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold neon-text">
                  {stat.value}
                </div>
                <div className="text-[var(--text-secondary)] text-sm mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Research <span className="neon-text">Superpowers</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              Everything you need to research prospects and close more deals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 card-hover"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="neon-text">Works</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Paste a URL or Upload PDF', desc: 'LinkedIn, company website, resume, or any document' },
              { step: '02', title: 'AI Analyzes Content', desc: 'Mistral AI extracts key information and context' },
              { step: '03', title: 'Get Actionable Insights', desc: 'Receive conversation starters, pain points, and opportunities' },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass p-6 flex items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center text-2xl font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <PricingTiers />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass p-12 text-center neon-glow"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="neon-text">10x Your Outreach?</span>
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Join solopreneurs and founders saving 10+ hours a week on research.
          </p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4 pulse-glow"
            >
              Start Free Today
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold">LeadGen AI</span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">
            © 2026 LeadGen AI. Built with ❤️ for solopreneurs.
          </p>
        </div>
      </footer>
    </main>
  );
}
