import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">U</span>
              </div>
              <span className="font-semibold">Upstage Demo</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Experience the power of advanced AI capabilities for document processing and understanding.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                API Documentation <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                Console <ExternalLink className="w-3 h-3" />
              </a>
              <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                Pricing <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-3 h-3" />
                GitHub
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 Upstage. Built with modern web technologies for demonstration purposes.
        </div>
      </div>
    </footer>
  );
};

export default Footer;