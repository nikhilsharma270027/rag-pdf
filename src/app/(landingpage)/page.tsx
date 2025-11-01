"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Brain, Search, Sparkles } from "lucide-react";
import { HeroSection } from "../../components/sections/HeroSection";
import { FeaturesGrid } from "../../components/sections/FeatureGrid";

const features = [
  {
    icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-[#22c55e]" />,
    title: "Upload Any PDF",
    description: "Easily upload research papers, notes, or documents to start interacting instantly.",
  },
  {
    icon: <Search className="h-5 w-5 sm:h-6 sm:w-6 text-[#22c55e]" />,
    title: "Ask Anything",
    description: "Ask natural language questions about your PDF and get accurate, contextual answers.",
  },
  {
    icon: <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-[#22c55e]" />,
    title: "Powered by RAG + AI",
    description: "Leverages Retrieval-Augmented Generation for precise, intelligent responses.",
  },
  {
    icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-[#22c55e]" />,
    title: "Instant Insights",
    description: "Summarize, extract key points, and understand your PDF faster than ever.",
  },
];

export default function Page() {
  const router = useRouter();

  // Example: redirect if already authenticated (optional)
  useEffect(() => {
    const userLoggedIn = false; // replace with actual session logic
    if (userLoggedIn) router.push("/dashboard");
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 bg-transparent">
      <HeroSection
        title="Welcome to"
        highlightedText="RAG-PDF"
        description="Chat with your PDFs using the power of Retrieval-Augmented Generation and AI."
        ctaText="Get Started"
        ctaLink="/auth"
      />
      <FeaturesGrid features={features} />
    </div>
  );
}
