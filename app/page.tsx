import Navbar from "@/layout/Navbar";
import Footer from "@/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AppPreviewSection from "@/components/landing/AppPreviewSection";
import PrinciplesSection from "@/components/landing/PrinciplesSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";

export default function LandingPage() {
  return <><Navbar /><main><HeroSection /><FeaturesSection /><AppPreviewSection /><PrinciplesSection /><FAQSection /><CTASection /></main><Footer /></>;
}
