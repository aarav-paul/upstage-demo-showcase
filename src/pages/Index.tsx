import Header from "@/components/Header";
import Hero from "@/components/Hero";
import DocumentParseDemo from "@/components/DocumentParseDemo";
import InformationExtractorDemo from "@/components/InformationExtractorDemo";
import SolarLLMDemo from "@/components/SolarLLMDemo";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <DocumentParseDemo />
      <InformationExtractorDemo />
      <SolarLLMDemo />
      <Footer />
    </div>
  );
};

export default Index;
