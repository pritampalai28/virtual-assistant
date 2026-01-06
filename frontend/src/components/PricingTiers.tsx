'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';

const tiers = [
    {
        name: 'Free',
        price: '₹0',
        period: 'forever',
        description: 'Perfect for trying out',
        features: [
            '5 research reports/month',
            'URL analysis',
            'Basic conversation starters',
            'Pain points identification',
        ],
        icon: Zap,
        gradient: 'from-gray-500 to-gray-600',
        buttonClass: 'btn-secondary',
        popular: false,
    },
    {
        name: 'Pro',
        price: '₹499',
        period: '/month',
        description: 'For serious solopreneurs',
        features: [
            '50 research reports/month',
            'URL + PDF analysis',
            'Email draft generation',
            'Market gap reports',
            'Priority processing',
        ],
        icon: Zap,
        gradient: 'from-[var(--neon-blue)] to-[var(--neon-purple)]',
        buttonClass: 'btn-primary',
        popular: true,
    },
    {
        name: 'Business',
        price: '₹1,499',
        period: '/month',
        description: 'For growing teams',
        features: [
            'Unlimited research reports',
            'Everything in Pro',
            'API access',
            'Team collaboration',
            'Custom integrations',
            'Priority support',
        ],
        icon: Crown,
        gradient: 'from-[var(--neon-purple)] to-[var(--neon-pink)]',
        buttonClass: 'btn-primary',
        popular: false,
    },
];

export default function PricingTiers() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Simple, <span className="neon-text">Transparent</span> Pricing
                    </h2>
                    <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                        Start free, upgrade when you need more. No hidden fees.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative glass p-8 card-hover ${tier.popular ? 'neon-glow' : ''}`}
                        >
                            {/* Popular badge */}
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tier.gradient} flex items-center justify-center mb-6`}>
                                <tier.icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Name & Price */}
                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                <span className="text-[var(--text-secondary)]">{tier.period}</span>
                            </div>
                            <p className="text-[var(--text-secondary)] mb-6">{tier.description}</p>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-[var(--neon-green)]" />
                                        <span className="text-[var(--text-secondary)]">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full ${tier.buttonClass}`}
                            >
                                {tier.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
