import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";

const DocumentParseDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileUpload = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setResult({
        tables: 3,
        forms: 2,
        text_blocks: 15,
        rotated_content: 1,
        confidence: 98.5
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <section id="document-parse" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Document Parse</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handle complex document layouts, rotated forms, and tabular data with precision. 
            Upload any document to see our parsing capabilities in action.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Document
              </CardTitle>
              <CardDescription>
                Supports PDF, PNG, JPG, and other document formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drop your document here or click to browse
                </p>
                <Button onClick={handleFileUpload} disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Choose File"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Parsing Results
              </CardTitle>
              <CardDescription>
                Structured output from document analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.tables}</div>
                      <div className="text-sm text-muted-foreground">Tables Detected</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.forms}</div>
                      <div className="text-sm text-muted-foreground">Forms Found</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.text_blocks}</div>
                      <div className="text-sm text-muted-foreground">Text Blocks</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.confidence}%</div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/20 rounded-lg">
                    <h4 className="font-medium mb-2">Key Features Detected:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Complex table structures with merged cells</li>
                      <li>✓ Rotated text content (90° rotation detected)</li>
                      <li>✓ Form fields with labels and values</li>
                      <li>✓ Multi-column text layout</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Upload a document to see parsing results
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DocumentParseDemo;