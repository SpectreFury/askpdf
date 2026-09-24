import NavBar from "./_components/NavBar";
import HeroSection from "./_components/HeroSection";

export default function Home() {
  return (
    <main>
      <NavBar />
      <div className="container mx-auto">
        <div className="mt-20"></div>
        <HeroSection />
      </div>
    </main>
  );
}
