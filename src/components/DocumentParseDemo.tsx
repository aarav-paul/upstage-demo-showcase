import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Table, 
  Image, 
  Heading1, 
  List, 
  Calculator,
  BarChart3,
  RotateCw,
  Download,
  Eye,
  Code,
  FileCode
} from "lucide-react";

interface ParsedElement {
  id: number;
  category: string;
  content: {
    html: string;
    markdown: string;
    text: string;
  };
  coordinates: Array<{ x: number; y: number }>;
  page: number;
  confidence?: number;
}

interface ParsingResult {
  elements: ParsedElement[];
  content: {
    html: string;
    markdown: string;
    text: string;
  };
  model: string;
  usage: {
    pages: number;
  };
  processingTime: number;
  fileInfo: {
    name: string;
    size: string;
    type: string;
  };
}

const DocumentParseDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [result, setResult] = useState<ParsingResult | null>(null);
  const [selectedElement, setSelectedElement] = useState<ParsedElement | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample documents for demo
  const sampleDocuments = [
    {
      name: "Invoice Document",
      description: "Complex invoice with tables, forms, and mixed content",
      type: "invoice"
    },
    {
      name: "Research Paper",
      description: "Academic paper with equations, charts, and structured content",
      type: "research"
    },
    {
      name: "Financial Report",
      description: "Report with charts, tables, and numerical data",
      type: "financial"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'table': return <Table className="w-4 h-4" />;
      case 'figure': return <Image className="w-4 h-4" />;
      case 'chart': return <BarChart3 className="w-4 h-4" />;
      case 'heading1': return <Heading1 className="w-4 h-4" />;
      case 'list': return <List className="w-4 h-4" />;
      case 'equation': return <Calculator className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'table': return 'bg-blue-100 text-blue-800';
      case 'figure': return 'bg-green-100 text-green-800';
      case 'chart': return 'bg-purple-100 text-purple-800';
      case 'heading1': return 'bg-orange-100 text-orange-800';
      case 'list': return 'bg-yellow-100 text-yellow-800';
      case 'equation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const simulateProcessing = (documentType: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setResult(null);

    // Simulate processing stages
    const stages = [
      { progress: 20, message: "Uploading document..." },
      { progress: 40, message: "Analyzing layout..." },
      { progress: 60, message: "Detecting elements..." },
      { progress: 80, message: "Processing tables and charts..." },
      { progress: 95, message: "Generating structured output..." },
      { progress: 100, message: "Complete!" }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProcessingProgress(stages[currentStage].progress);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setResult(generateRealisticResult(documentType));
          setIsProcessing(false);
          setProcessingProgress(0);
        }, 500);
      }
    }, 800);
  };

  const generateRealisticResult = (documentType: string): ParsingResult => {
    const baseElements: ParsedElement[] = [
      {
        id: 0,
        category: "heading1",
        content: {
          html: "<h1 id='0' style='font-size:22px'>INVOICE</h1>",
          markdown: "# INVOICE",
          text: "INVOICE"
        },
        coordinates: [
          { x: 0.0648, y: 0.0517 },
          { x: 0.2405, y: 0.0517 },
          { x: 0.2405, y: 0.0953 },
          { x: 0.0648, y: 0.0953 }
        ],
        page: 1,
        confidence: 98.5
      },
      {
        id: 1,
        category: "table",
        content: {
          html: `<table>
            <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
            <tr><td>Product A</td><td>2</td><td>$50.00</td><td>$100.00</td></tr>
            <tr><td>Product B</td><td>1</td><td>$75.00</td><td>$75.00</td></tr>
            <tr><td><strong>Total</strong></td><td></td><td></td><td><strong>$175.00</strong></td></tr>
          </table>`,
          markdown: "| Item | Quantity | Price | Total |\n|------|----------|-------|-------|\n| Product A | 2 | $50.00 | $100.00 |\n| Product B | 1 | $75.00 | $75.00 |\n| **Total** |  |  | **$175.00** |",
          text: "Item Quantity Price Total Product A 2 $50.00 $100.00 Product B 1 $75.00 $75.00 Total $175.00"
        },
        coordinates: [
          { x: 0.1, y: 0.3 },
          { x: 0.9, y: 0.3 },
          { x: 0.9, y: 0.6 },
          { x: 0.1, y: 0.6 }
        ],
        page: 1,
        confidence: 96.2
      }
    ];

    if (documentType === 'research') {
      baseElements.push(
        {
          id: 2,
          category: "equation",
          content: {
            html: "<p id='2' data-category='equation'>$$a_{n}=\\sum_{k=1}^{n}{\\frac{2k+1}{\\,1^{2}+2^{2}+3^{2}+\\cdots+k^{2}}}$$</p>",
            markdown: "$$a_{n}=\\sum_{k=1}^{n}{\\frac{2k+1}{\\,1^{2}+2^{2}+3^{2}+\\cdots+k^{2}}}$$",
            text: "an = sum from k=1 to n of (2k+1)/(1^2 + 2^2 + 3^2 + ... + k^2)"
          },
          coordinates: [
            { x: 0.2, y: 0.4 },
            { x: 0.8, y: 0.4 },
            { x: 0.8, y: 0.5 },
            { x: 0.2, y: 0.5 }
          ],
          page: 1,
          confidence: 94.8
        },
        {
          id: 3,
          category: "chart",
          content: {
            html: `<figure id='3' data-category='chart'>
              <img data-coord="top-left:(118,157); bottom-right:(900,393)" />
              <figcaption>
                <p>Chart Title: Research Results Comparison</p>
                <p>X-Axis: Time Period</p>
                <p>Y-Axis: Performance Score</p>
                <p>Chart Type: line</p>
              </figcaption>
              <table>
                <tr><th></th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th></tr>
                <tr><td>Group A</td><td>85%</td><td>87%</td><td>89%</td><td>92%</td></tr>
                <tr><td>Group B</td><td>78%</td><td>82%</td><td>85%</td><td>88%</td></tr>
              </table>
            </figure>`,
            markdown: "## Research Results Comparison\n|  | Q1 | Q2 | Q3 | Q4 |\n| --- | --- | --- | --- | --- |\n| Group A | 85% | 87% | 89% | 92% |\n| Group B | 78% | 82% | 85% | 88% |",
            text: "Research Results Comparison Q1 Q2 Q3 Q4 Group A 85% 87% 89% 92% Group B 78% 82% 85% 88%"
          },
          coordinates: [
            { x: 0.1, y: 0.6 },
            { x: 0.9, y: 0.6 },
            { x: 0.9, y: 0.9 },
            { x: 0.1, y: 0.9 }
          ],
          page: 1,
          confidence: 97.3
        }
      );
    }

    if (documentType === 'financial') {
      baseElements.push(
        {
          id: 4,
          category: "list",
          content: {
            html: "<p id='4' data-category='list'>1. Revenue increased by 15% year-over-year<br>2. Operating expenses decreased by 8%<br>3. Net profit margin improved to 12.5%<br>4. Cash flow remained positive throughout the quarter</p>",
            markdown: "1. Revenue increased by 15% year-over-year\n2. Operating expenses decreased by 8%\n3. Net profit margin improved to 12.5%\n4. Cash flow remained positive throughout the quarter",
            text: "1. Revenue increased by 15% year-over-year 2. Operating expenses decreased by 8% 3. Net profit margin improved to 12.5% 4. Cash flow remained positive throughout the quarter"
          },
          coordinates: [
            { x: 0.1, y: 0.7 },
            { x: 0.9, y: 0.7 },
            { x: 0.9, y: 0.85 },
            { x: 0.1, y: 0.85 }
          ],
          page: 1,
          confidence: 99.1
        }
      );
    }

    return {
      elements: baseElements,
      content: {
        html: baseElements.map(el => el.content.html).join('\n'),
        markdown: baseElements.map(el => el.content.markdown).join('\n\n'),
        text: baseElements.map(el => el.content.text).join('\n')
      },
      model: "document-parse-250404",
      usage: { pages: 1 },
      processingTime: 2.3,
      fileInfo: {
        name: `${documentType}_document.pdf`,
        size: "2.4 MB",
        type: "application/pdf"
      }
    };
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use a random document type
      const types = ['invoice', 'research', 'financial'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      simulateProcessing(randomType);
    }
  };

  const handleSampleDocument = (type: string) => {
    simulateProcessing(type);
  };

  const downloadResult = (format: 'html' | 'markdown' | 'json') => {
    if (!result) return;
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch (format) {
      case 'html':
        content = result.content.html;
        filename = 'parsed_document.html';
        mimeType = 'text/html';
        break;
      case 'markdown':
        content = result.content.markdown;
        filename = 'parsed_document.md';
        mimeType = 'text/markdown';
        break;
      case 'json':
        content = JSON.stringify(result, null, 2);
        filename = 'parsed_document.json';
        mimeType = 'application/json';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="document-parse" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Document Parse</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Automatically convert any document to structured text (HTML or Markdown) with advanced layout detection. 
            Handles complex layouts, tables, charts, equations, and rotated content with precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Document
                </CardTitle>
                <CardDescription>
                  Supports PDF, PNG, JPG, DOCX, PPTX, XLSX, and more (max 50MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={handleFileUpload}
                >
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drop your document here or click to browse
                  </p>
                  <Button disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Choose File"}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.bmp,.tiff,.heic,.docx,.pptx,.xlsx,.hwp,.hwpx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Sample Documents */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Try Sample Documents
                </CardTitle>
                <CardDescription>
                  Test with pre-configured sample documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleSampleDocument(doc.type)}
                    >
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isProcessing && (
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5 animate-spin" />
                    Processing Document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={processingProgress} className="mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing layout, detecting elements, and generating structured output...
                  </p>
                </CardContent>
              </Card>
            )}

            {result && (
              <>
                {/* Overview Card */}
                <Card className="bg-gradient-card border-0 shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Parsing Results
                    </CardTitle>
                    <CardDescription>
                      Document processed successfully in {result.processingTime}s
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{result.elements.length}</div>
                        <div className="text-sm text-muted-foreground">Elements Detected</div>
                      </div>
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{result.usage.pages}</div>
                        <div className="text-sm text-muted-foreground">Pages Processed</div>
                      </div>
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{result.elements.filter(el => el.category === 'table').length}</div>
                        <div className="text-sm text-muted-foreground">Tables Found</div>
                      </div>
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{result.elements.filter(el => el.category === 'chart').length}</div>
                        <div className="text-sm text-muted-foreground">Charts Recognized</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => downloadResult('html')}>
                        <Download className="w-4 h-4 mr-2" />
                        HTML
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => downloadResult('markdown')}>
                        <Download className="w-4 h-4 mr-2" />
                        Markdown
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => downloadResult('json')}>
                        <FileCode className="w-4 h-4 mr-2" />
                        JSON
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Results */}
                <Card className="bg-gradient-card border-0 shadow-medium">
                  <CardHeader>
                    <CardTitle>Detailed Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="elements">Elements</TabsTrigger>
                        <TabsTrigger value="output">Output</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="mt-4">
                        <div className="space-y-3">
                          {result.elements.map((element) => (
                            <div
                              key={element.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/20 cursor-pointer"
                              onClick={() => setSelectedElement(element)}
                            >
                              <div className="flex items-center gap-3">
                                {getCategoryIcon(element.category)}
                                <div>
                                  <div className="font-medium text-sm">
                                    {element.category.charAt(0).toUpperCase() + element.category.slice(1)} #{element.id}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Page {element.page} • Confidence: {element.confidence}%
                                  </div>
                                </div>
                              </div>
                              <Badge className={getCategoryColor(element.category)}>
                                {element.category}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="elements" className="mt-4">
                        {selectedElement ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">
                                {selectedElement.category.charAt(0).toUpperCase() + selectedElement.category.slice(1)} #{selectedElement.id}
                              </h4>
                              <Badge className={getCategoryColor(selectedElement.category)}>
                                {selectedElement.category}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Page:</strong> {selectedElement.page}
                              </div>
                              <div>
                                <strong>Confidence:</strong> {selectedElement.confidence}%
                              </div>
                            </div>
                            
                            <div>
                              <strong>Coordinates:</strong>
                              <div className="text-xs font-mono bg-secondary/30 p-2 rounded mt-1">
                                {selectedElement.coordinates.map((coord, i) => (
                                  <div key={i}>Point {i + 1}: ({coord.x.toFixed(4)}, {coord.y.toFixed(4)})</div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <strong>Content:</strong>
                              <div className="mt-2 space-y-2">
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">HTML:</div>
                                  <div className="text-xs font-mono bg-secondary/30 p-2 rounded max-h-32 overflow-y-auto">
                                    {selectedElement.content.html}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground mb-1">Markdown:</div>
                                  <div className="text-xs font-mono bg-secondary/30 p-2 rounded max-h-32 overflow-y-auto">
                                    {selectedElement.content.markdown}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            Select an element from the overview to see details
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="output" className="mt-4">
                        <Tabs defaultValue="html" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="html">HTML</TabsTrigger>
                            <TabsTrigger value="markdown">Markdown</TabsTrigger>
                            <TabsTrigger value="text">Text</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="html" className="mt-4">
                            <div className="bg-secondary/30 p-4 rounded-lg max-h-64 overflow-y-auto">
                              <pre className="text-xs font-mono whitespace-pre-wrap">{result.content.html}</pre>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="markdown" className="mt-4">
                            <div className="bg-secondary/30 p-4 rounded-lg max-h-64 overflow-y-auto">
                              <pre className="text-xs font-mono whitespace-pre-wrap">{result.content.markdown}</pre>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="text" className="mt-4">
                            <div className="bg-secondary/30 p-4 rounded-lg max-h-64 overflow-y-auto">
                              <pre className="text-xs font-mono whitespace-pre-wrap">{result.content.text}</pre>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Advanced Features</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Chart Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically detect and convert charts (bar, line, pie) into structured tables with metadata.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Bar charts
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Line charts
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Pie charts
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Equation Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Detect mathematical equations and convert them to LaTeX format for rendering with MathJax.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    LaTeX format output
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    MathJax compatible
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Complex mathematical expressions
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCw className="w-5 h-5" />
                  Layout Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Handle complex layouts including rotated text, multi-column content, and mixed media.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Rotated content (90°)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Multi-column layouts
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Mixed media documents
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentParseDemo;