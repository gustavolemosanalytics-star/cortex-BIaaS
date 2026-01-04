"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Search,
    Star,
    Download,
    Filter,
    BarChart3,
    TrendingUp,
    ShoppingCart,
    Users,
    DollarSign,
    Target
} from "lucide-react";

// Mock templates data
const templates = [
    {
        id: "1",
        name: "E-commerce Analytics",
        description: "Dashboard completo para lojas virtuais com métricas de vendas, conversão e faturamento.",
        category: "E-commerce",
        price: 0,
        rating: 4.8,
        downloads: 1250,
        icon: ShoppingCart,
        gradient: "from-violet-500 to-purple-600",
        isFeatured: true,
    },
    {
        id: "2",
        name: "Meta Ads Performance",
        description: "Acompanhe campanhas do Facebook e Instagram com métricas detalhadas de performance.",
        category: "Marketing",
        price: 49.90,
        rating: 4.9,
        downloads: 890,
        icon: Target,
        gradient: "from-blue-500 to-indigo-600",
        isFeatured: true,
    },
    {
        id: "3",
        name: "SaaS Metrics",
        description: "MRR, Churn, LTV e outras métricas essenciais para negócios SaaS.",
        category: "SaaS",
        price: 79.90,
        rating: 4.7,
        downloads: 650,
        icon: TrendingUp,
        gradient: "from-emerald-500 to-teal-600",
        isFeatured: false,
    },
    {
        id: "4",
        name: "Google Ads Overview",
        description: "Visualize performance de campanhas Google Ads com ROI e custo por conversão.",
        category: "Marketing",
        price: 39.90,
        rating: 4.6,
        downloads: 720,
        icon: BarChart3,
        gradient: "from-orange-500 to-red-600",
        isFeatured: false,
    },
    {
        id: "5",
        name: "Customer Analytics",
        description: "Análise de comportamento de clientes, segmentação e cohort analysis.",
        category: "Analytics",
        price: 59.90,
        rating: 4.5,
        downloads: 430,
        icon: Users,
        gradient: "from-pink-500 to-rose-600",
        isFeatured: false,
    },
    {
        id: "6",
        name: "Financial Dashboard",
        description: "Controle financeiro com receitas, despesas, fluxo de caixa e projeções.",
        category: "Finanças",
        price: 0,
        rating: 4.8,
        downloads: 980,
        icon: DollarSign,
        gradient: "from-cyan-500 to-blue-600",
        isFeatured: true,
    },
];

const categories = ["Todos", "E-commerce", "Marketing", "SaaS", "Analytics", "Finanças"];

const MockPreview = () => (
    <div className="absolute inset-x-0 top-2 bottom-20 mx-2 bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex flex-col gap-2 p-3 border border-border/50 rounded-xl shadow-sm translate-y-4 group-hover:translate-y-0 pointer-events-none">
        <div className="w-full h-6 bg-muted rounded-md flex items-center px-2 gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-400/50"></div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="bg-primary/10 rounded-md"></div>
            <div className="bg-primary/10 rounded-md"></div>
            <div className="col-span-2 bg-muted/50 rounded-md flex-1"></div>
        </div>
        <div className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-wider">Preview</div>
    </div>
);

export default function MarketplacePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "Todos" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
                    <p className="text-muted-foreground">
                        Escolha templates prontos para começar rapidamente
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar templates..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className="whitespace-nowrap"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Featured Section */}
                {selectedCategory === "Todos" && searchQuery === "" && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            Destaque
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {templates.filter(t => t.isFeatured).map((template, index) => (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-2 border-primary/20 relative">
                                        <MockPreview />
                                        <div className={`h-2 bg-gradient-to-r ${template.gradient}`} />
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className={`p-3 rounded-xl bg-gradient-to-br ${template.gradient} text-white`}>
                                                    <template.icon className="h-6 w-6" />
                                                </div>
                                                {template.price === 0 ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full dark:bg-green-900 dark:text-green-100">
                                                        Grátis
                                                    </span>
                                                ) : (
                                                    <span className="text-lg font-bold text-primary">
                                                        R$ {template.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <CardTitle className="mt-4">{template.name}</CardTitle>
                                            <CardDescription>{template.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    {template.rating}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Download className="h-4 w-4" />
                                                    {template.downloads}
                                                </span>
                                            </div>
                                            <Button size="sm">
                                                {template.price === 0 ? "Usar Template" : "Comprar"}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Templates */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        {searchQuery || selectedCategory !== "Todos"
                            ? `Resultados (${filteredTemplates.length})`
                            : "Todos os Templates"
                        }
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTemplates.map((template, index) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                                    <MockPreview />
                                    <div className={`h-1 bg-gradient-to-r ${template.gradient}`} />
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className={`p-2.5 rounded-lg bg-gradient-to-br ${template.gradient} text-white`}>
                                                <template.icon className="h-5 w-5" />
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                                                {template.category}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg mt-3">{template.name}</CardTitle>
                                        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex items-center justify-between border-t pt-4">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                                {template.rating}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Download className="h-3.5 w-3.5" />
                                                {template.downloads}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {template.price === 0 ? (
                                                <span className="text-sm font-medium text-green-600 dark:text-green-400">Grátis</span>
                                            ) : (
                                                <span className="text-sm font-bold">R$ {template.price.toFixed(2)}</span>
                                            )}
                                            <Button size="sm" variant="outline">
                                                Ver
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
                            <p className="text-muted-foreground">
                                Tente ajustar sua busca ou filtros
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
