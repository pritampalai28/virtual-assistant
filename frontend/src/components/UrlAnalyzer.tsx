'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AnalysisResult {
    url: string;
    title: string;
    summary: string;
    conversation_starters: string[];
    pain_points: string[];
    market_gaps: string[];
}

interface UrlAnalyzerProps {
    onResult?: (result: AnalysisResult) => void;
    sessionId: string;
}

export default function UrlAnalyzer({ onResult, sessionId }: UrlAnalyzerProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const analyzeUrl = async () => {
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await axios.post(`${API_URL}/api/analyze-url`, {
                url: url.trim(),
                session_id: sessionId,
            });

            if (response.data.success) {
                setResult(response.data.data);
                onResult?.(response.data.data);
            } else {
                setError(response.data.error || 'Analysis failed');
            }
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { error?: string } } };
            if (axiosError.response?.data?.error) {
                setError(axiosError.response.data.error);
            } else {
                setError('Failed to analyze URL. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Search Input */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-2 flex gap-2"
            >
                <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 text-[var(--text-secondary)]" />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && analyzeUrl()}
                        placeholder="Paste LinkedIn profile, company website, or any URL..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-[var(--text-secondary)]"
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={analyzeUrl}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        'Analyze'
                    )}
                </motion.button>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400">{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-8 space-y-6"
                    >
                        {/* Summary */}
                        <div className="glass p-6">
                            <h3 className="text-lg font-semibold neon-text mb-2">{result.title}</h3>
                            <p className="text-[var(--text-secondary)]">{result.summary}</p>
                        </div>

                        {/* Conversation Starters */}
                        <div className="glass p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center text-sm">
                                    💬
                                </span>
                                Conversation Starters
                            </h3>
                            <div className="space-y-3">
                                {result.conversation_starters.map((starter, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--neon-blue)]/50 transition-colors cursor-pointer"
                                    >
                                        <span className="text-[var(--neon-blue)] mr-2">#{idx + 1}</span>
                                        {starter}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Pain Points & Market Gaps */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass p-6">
                                <h3 className="text-lg font-bold mb-4 text-[var(--neon-pink)]">
                                    🎯 Pain Points
                                </h3>
                                <ul className="space-y-2">
                                    {result.pain_points.map((point, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 + idx * 0.1 }}
                                            className="text-[var(--text-secondary)] flex items-start gap-2"
                                        >
                                            <span className="text-[var(--neon-pink)]">•</span>
                                            {point}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            <div className="glass p-6">
                                <h3 className="text-lg font-bold mb-4 text-[var(--neon-green)]">
                                    🚀 Market Opportunities
                                </h3>
                                <ul className="space-y-2">
                                    {result.market_gaps.map((gap, idx) => (
                                        <motion.li
                                            key={idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8 + idx * 0.1 }}
                                            className="text-[var(--text-secondary)] flex items-start gap-2"
                                        >
                                            <span className="text-[var(--neon-green)]">•</span>
                                            {gap}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
