'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AnalysisResult {
    filename: string;
    metadata: {
        num_pages: number;
        title?: string;
        author?: string;
    };
    summary: string;
    conversation_starters: string[];
    pain_points: string[];
    market_gaps: string[];
}

interface PdfUploaderProps {
    onResult?: (result: AnalysisResult) => void;
    sessionId: string;
}

export default function PdfUploader({ onResult, sessionId }: PdfUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === 'application/pdf') {
            setFile(droppedFile);
            setError('');
        } else {
            setError('Please upload a PDF file');
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile?.type === 'application/pdf') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please upload a PDF file');
        }
    };

    const analyzePdf = async () => {
        if (!file) return;

        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('session_id', sessionId);

        try {
            const response = await axios.post(`${API_URL}/api/analyze-pdf`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
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
                setError('Failed to analyze PDF. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Upload Area */}
            {!result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`glass p-8 border-2 border-dashed transition-colors ${isDragging
                            ? 'border-[var(--neon-blue)] bg-[var(--neon-blue)]/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                >
                    {!file ? (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20 flex items-center justify-center">
                                <Upload className="w-8 h-8 text-[var(--neon-blue)]" />
                            </div>
                            <div>
                                <p className="text-lg font-medium mb-1">
                                    Drop your PDF here or{' '}
                                    <label className="text-[var(--neon-blue)] cursor-pointer hover:underline">
                                        browse
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                </p>
                                <p className="text-[var(--text-secondary)] text-sm">
                                    Upload a resume, company document, or any PDF to analyze
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-[var(--text-secondary)] text-sm">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={analyzePdf}
                                    disabled={loading}
                                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Analyze PDF'
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

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
                        {/* File Info */}
                        <div className="glass p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{result.filename}</h3>
                                    <p className="text-[var(--text-secondary)] text-sm">
                                        {result.metadata.num_pages} pages
                                        {result.metadata.author && ` • By ${result.metadata.author}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setFile(null);
                                }}
                                className="btn-secondary text-sm py-2 px-4"
                            >
                                Analyze Another
                            </button>
                        </div>

                        {/* Summary */}
                        <div className="glass p-6">
                            <h3 className="text-lg font-semibold neon-text mb-2">Summary</h3>
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
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--neon-blue)]/50 transition-colors"
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
