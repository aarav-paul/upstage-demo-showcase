import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Scan, Code, Database } from "lucide-react";

const InformationExtractorDemo = () => {
  const [schema, setSchema] = useState(`{
  "name": "string",
  "email": "string", 
  "phone": "string",
  "address": "string",
  "total_amount": "number",
  "date": "date"
}`);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleExtraction = () => {
    setIsExtracting(true);
    // Simulate extraction
    setTimeout(() => {
      setExtractedData({
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, City, State 12345",
        total_amount: 1299.99,
        date: "2024-07-02",
        confidence_scores: {
          name: 96,
          email: 98,
          phone: 94,
          address: 89,
          total_amount: 97,
          date: 100
        }
      });
      setIsExtracting(false);
    }, 1500);
  };

  return (
    <section id="information-extractor" className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Universal Information Extractor</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Extract structured fields from unstructured documents using schema-based processing. 
            Define your schema and watch as we extract precise data.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Define Schema
              </CardTitle>
              <CardDescription>
                Specify the data structure you want to extract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                rows={12}
                className="font-mono text-sm"
                placeholder="Define your extraction schema..."
              />
              <Button className="w-full mt-4" onClick={handleExtraction} disabled={isExtracting}>
                {isExtracting ? "Extracting..." : "Extract Information"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5" />
                Sample Document
              </CardTitle>
              <CardDescription>
                Document being processed for extraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/30 p-4 rounded-lg text-sm space-y-2 border">
                <div className="font-semibold">INVOICE #INV-2024-001</div>
                <div className="text-muted-foreground">Date: July 2, 2024</div>
                <hr className="my-2" />
                <div><strong>Bill To:</strong></div>
                <div>John Smith</div>
                <div>john.smith@email.com</div>
                <div>+1 (555) 123-4567</div>
                <div>123 Main St, City, State 12345</div>
                <hr className="my-2" />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Product A</span>
                    <span>$599.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Product B</span>
                    <span>$700.00</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$1,299.99</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Extracted Data
              </CardTitle>
              <CardDescription>
                Structured output based on your schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {extractedData ? (
                <div className="space-y-3">
                  {Object.entries(extractedData).map(([key, value]) => {
                    if (key === 'confidence_scores') return null;
                    const confidence = extractedData.confidence_scores[key];
                    return (
                      <div key={key} className="bg-secondary/50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-muted-foreground">{key}</span>
                          <span className="text-xs text-primary">{confidence}%</span>
                        </div>
                        <div className="font-mono text-sm">{String(value)}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Click "Extract Information" to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InformationExtractorDemo;