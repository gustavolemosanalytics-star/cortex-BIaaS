import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cortex - Plataforma de Business Intelligence",
    description: "Transforme seus dados de marketing em insights acionáveis. Dashboards inteligentes para empresas que buscam crescimento.",
};

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
