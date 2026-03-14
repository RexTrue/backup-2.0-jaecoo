import Navbar from "../components/navbar";
import HeroSection from "../components/hero-section";
import Footer from "../components/footer";

export default function LandingPage() {
  return (
    <main className="landing-page fade-in">
      <Navbar />
      <HeroSection />
      <Footer />
    </main>
  );
}