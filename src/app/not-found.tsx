import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full inline-block">
                    <BarChart3 className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">404</h1>
                <h2 className="text-xl font-semibold">Página não encontrada</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    O dashboard ou página que você está procurando não existe ou foi removido.
                </p>
                <div className="pt-4">
                    <Button asChild>
                        <Link href="/dashboards">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar ao Início
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
