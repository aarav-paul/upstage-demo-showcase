import { Button } from "@/components/ui/button";
import { FileText, Scan, MessageCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Upstage AI Capabilities
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the power of advanced document processing, information extraction, 
          and AI reasoning with our interactive demos.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-6 shadow-medium hover:shadow-large transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Document Parse</h3>
            <p className="text-muted-foreground text-sm">
              Handle complex layouts, rotated forms, and tabular data with precision.
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-medium hover:shadow-large transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Scan className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Information Extractor</h3>
            <p className="text-muted-foreground text-sm">
              Extract structured fields from unstructured documents via schema-based processing.
            </p>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-medium hover:shadow-large transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Solar LLM</h3>
            <p className="text-muted-foreground text-sm">
              General-purpose reasoning and contextual understanding for document-based Q&A.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <Button size="lg" className="mr-4">
            Try Demos Below
          </Button>
          <Button variant="outline" size="lg">
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;