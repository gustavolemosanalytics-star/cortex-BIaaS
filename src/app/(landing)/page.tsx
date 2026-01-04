"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
    BarChart3,
    Zap,
    LineChart,
    PieChart,
    TrendingUp,
    MessageSquare,
    ArrowRight,
    Sparkles,
    Target,
    Rocket,
    Smartphone,
    CheckCircle2,
    Shield,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/landing/particle-background";
import { useState } from "react";

const GlowingCard = ({
    children,
    delay = 0,
    className = ""
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ scale: 1.01, y: -2 }}
        className={`relative group bg-white border border-slate-200 rounded-2xl p-8 h-full flex flex-col shadow-sm hover:shadow-md transition-all ${className}`}
    >
        {children}
    </motion.div>
);

export default function LandingPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const features = [
        {
            icon: BarChart3,
            title: "Dashboards Premium",
            description: "Templates de alta conversão prontos para usar.",
        },
        {
            icon: MessageSquare,
            title: "Relatórios via WhatsApp",
            description: "Receba insights da IA diretamente no seu celular.",
        },
        {
            icon: Zap,
            title: "Setup Instantâneo",
            description: "Conecte suas contas e visualize em segundos.",
        },
        {
            icon: Target,
            title: "Foco em ROI",
            description: "Métricas que realmente trazem dinheiro.",
        },
    ];

    const pricing = [
        {
            title: "Simples",
            price: "15",
            description: "Para quem está começando a escalar.",
            features: ["1 Dashboard", "Atualização Diária", "Suporte Básico"],
            highlight: false
        },
        {
            title: "Elaborado",
            price: "20",
            description: "Para operações que exigem profundidade.",
            features: ["Dashboard Complexo", "Relatórios WhatsApp IA", "Atualização em Tempo Real", "Conectores Premium"],
            highlight: true
        }
    ];

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900"
        >
            {/* Background */}
            <ParticleBackground />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                            <span className="font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-medium tracking-tight text-slate-900">
                            Cortex
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                            Recursos
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                            Preços
                        </Link>
                        <div className="h-4 w-px bg-slate-200" />
                        <Link href="/login" className="text-sm font-medium text-slate-900 hover:text-indigo-600">
                            Entrar
                        </Link>
                        <Link href="/register">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-sm hover:shadow-indigo-200 transition-all">
                                Começar
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-4 shadow-lg"
                    >
                        <Link href="#features" className="block text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Recursos</Link>
                        <Link href="#pricing" className="block text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Preços</Link>
                        <hr className="border-slate-100" />
                        <Link href="/login" className="block text-sm font-medium text-slate-900" onClick={() => setIsMenuOpen(false)}>Entrar</Link>
                        <Link href="/register" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full bg-indigo-600 text-white rounded-full">Começar</Button>
                        </Link>
                    </motion.div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium uppercase tracking-wider mx-auto">
                        <Sparkles className="w-3 h-3" />
                        <span>Antigravity Era</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-slate-900 leading-[1.1]">
                        Visualize. <span className="text-indigo-600">Domine.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        A inteligência do seu negócio, simplificada. Dashboards profissionais e insights via WhatsApp. Comece gratuitamente.
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Link href="/register">
                            <Button size="lg" className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-base shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5">
                                Criar Dashboard Grátis
                            </Button>
                        </Link>
                        <Link href="/demo">
                            <Button variant="ghost" size="lg" className="h-12 px-8 rounded-full text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                                Ver Demonstração
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Section - Clean & White */}
            <section id="features" className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-semibold text-slate-900 mb-4">Recursos Essenciais</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Tudo o que você precisa para tomar decisões melhores.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <GlowingCard key={index} delay={index * 0.1}>
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                            </GlowingCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section - Minimalist */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-semibold text-slate-900 mb-4">Preço Justo</h2>
                        <p className="text-slate-500">Pague pelo que usar. Cancele a qualquer momento.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {pricing.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative p-8 rounded-3xl border ${plan.highlight ? 'border-indigo-200 bg-indigo-50/50 shadow-xl shadow-indigo-100/50' : 'border-slate-100 bg-white shadow-lg shadow-slate-100'} flex flex-col h-full`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                                        Recomendado
                                    </div>
                                )}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-slate-900">{plan.title}</h3>
                                    <p className="text-slate-500 mt-2 text-sm">{plan.description}</p>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-slate-900">R$ {plan.price}</span>
                                    <span className="text-slate-500 font-medium">/mês</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`w-full h-12 rounded-xl text-base font-medium transition-all ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'}`}
                                >
                                    Começar Agora
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">C</div>
                        <span className="font-semibold text-slate-900">Cortex</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                        © 2024 Cortex. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500 show">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
