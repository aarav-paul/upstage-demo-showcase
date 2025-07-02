import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">U</span>
            </div>
            <h1 className="text-xl font-semibold">Upstage Demo</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#document-parse" className="text-muted-foreground hover:text-foreground transition-colors">
              Document Parse
            </a>
            <a href="#information-extractor" className="text-muted-foreground hover:text-foreground transition-colors">
              Information Extractor
            </a>
            <a href="#solar-llm" className="text-muted-foreground hover:text-foreground transition-colors">
              Solar LLM
            </a>
          </nav>
          <Button variant="default" size="sm">
            Try API
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;