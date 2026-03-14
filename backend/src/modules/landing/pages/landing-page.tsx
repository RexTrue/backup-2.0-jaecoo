import Navbar from "../components/navbar";
import HeroSection from "../components/hero-section";
import Footer from "../components/footer";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f5f5",
        fontFamily: "Helvetica, Arial, sans-serif",
        paddingTop: "96px",
        paddingBottom: "170px",
        boxSizing: "border-box",
      }}
    >
      <Navbar />
      <HeroSection />
      <Footer />
    </main>
  );
}