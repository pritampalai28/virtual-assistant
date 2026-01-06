'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Link2, FileText, History, BarChart3 } from 'lucide-react';
import UrlAnalyzer from '@/components/UrlAnalyzer';
import PdfUploader from '@/components/PdfUploader';

// Dynamic import for 3D scene
const Scene3D = dynamic(() => import('@/components/Scene3D'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 -z-10 gradient-bg" />,
});

type TabType = 'url' | 'pdf';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<TabType>('url');
    const [sessionId, setSessionId] = useState('');

    // Generate session ID on mount
    useEffect(() => {
        const stored = localStorage.getItem('leadgen_session_id');
        if (stored) {
            setSessionId(stored);
        } else {
            const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('leadgen_session_id', newId);
            setSessionId(newId);
        }
    }, []);

    const tabs = [
        { id: 'url' as const, label: 'Analyze URL', icon: Link2 },
        { id: 'pdf' as const, label: 'Upload PDF', icon: FileText },
    ];

    return (
        <main className="min-h-screen gradient-bg grid-pattern">
            <Scene3D />

            {/* Navigation */}
            <nav className="sticky top-0 z-50 p-4 border-b border-white/10 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold">LeadGen AI</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <History className="w-4 h-4" />
                            <span className="hidden sm:inline">History</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <BarChart3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Usage</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Research <span className="neon-text">Dashboard</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                        Paste a URL or upload a document to generate personalized insights.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center mb-8"
                >
                    <div className="inline-flex p-1 rounded-xl glass">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white'
                                        : 'text-[var(--text-secondary)] hover:text-white'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'url' ? (
                        <UrlAnalyzer sessionId={sessionId} />
                    ) : (
                        <PdfUploader sessionId={sessionId} />
                    )}
                </motion.div>

                {/* Usage Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12"
                >
                    <div className="glass p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[var(--text-secondary)]">Free Tier</span>
                            <span className="px-3 py-1 rounded-full text-sm bg-gradient-to-r from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20 text-[var(--neon-blue)]">
                                5 reports/month
                            </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-full"
                                style={{ width: '0%' }}
                            />
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-2">
                            0 of 5 reports used
                        </p>
                        <Link href="/#pricing">
                            <button className="mt-4 w-full btn-secondary text-sm py-2">
                                Upgrade to Pro - ₹499/month
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
