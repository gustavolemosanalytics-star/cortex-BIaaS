import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LandingPage from "./(landing)/page";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboards");
  }

  return <LandingPage />;
}
