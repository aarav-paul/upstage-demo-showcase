import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Scan, 
  Code, 
  Database, 
  Upload, 
  FileText, 
  Wand2, 
  Download,
  Copy,
  CheckCircle,
  RotateCw,
  Settings,
  FileCode,
  Sparkles
} from "lucide-react";

interface SchemaField {
  type: string;
  description: string;
  properties?: Record<string, SchemaField>;
  items?: SchemaField;
}

interface ExtractionResult {
  data: Record<string, any>;
  schema: {
    name: string;
    schema: {
      type: string;
      properties: Record<string, SchemaField>;
    };
  };
  processingTime: number;
  fileInfo: {
    name: string;
    size: string;
    type: string;
  };
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const InformationExtractorDemo = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeneratingSchema, setIsGeneratingSchema] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string>("invoice");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-defined schemas for different document types
  const predefinedSchemas = {
    invoice: {
      name: "invoice_schema",
      schema: {
        type: "object",
        properties: {
          invoice_number: {
            type: "string",
            description: "The invoice number or ID"
          },
          invoice_date: {
            type: "string",
            description: "The date when the invoice was issued"
          },
          customer_name: {
            type: "string",
            description: "The name of the customer or client"
          },
          customer_email: {
            type: "string",
            description: "The email address of the customer"
          },
          customer_phone: {
            type: "string",
            description: "The phone number of the customer"
          },
          customer_address: {
            type: "string",
            description: "The billing address of the customer"
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item_name: {
                  type: "string",
                  description: "The name or description of the item"
                },
                quantity: {
                  type: "number",
                  description: "The quantity of the item"
                },
                unit_price: {
                  type: "number",
                  description: "The price per unit of the item"
                },
                total_price: {
                  type: "number",
                  description: "The total price for this item"
                }
              }
            }
          },
          subtotal: {
            type: "number",
            description: "The subtotal amount before taxes"
          },
          tax_amount: {
            type: "number",
            description: "The tax amount"
          },
          total_amount: {
            type: "number",
            description: "The total amount including taxes"
          }
        }
      }
    },
    bank_statement: {
      name: "bank_statement_schema",
      schema: {
        type: "object",
        properties: {
          bank_name: {
            type: "string",
            description: "The name of the bank"
          },
          account_number: {
            type: "string",
            description: "The account number (masked if necessary)"
          },
          statement_period: {
            type: "string",
            description: "The period covered by this statement"
          },
          opening_balance: {
            type: "number",
            description: "The opening balance for the period"
          },
          closing_balance: {
            type: "number",
            description: "The closing balance for the period"
          },
          transactions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                transaction_date: {
                  type: "string",
                  description: "The date of the transaction"
                },
                transaction_description: {
                  type: "string",
                  description: "Description of the transaction"
                },
                transaction_amount: {
                  type: "number",
                  description: "The amount of the transaction"
                },
                transaction_type: {
                  type: "string",
                  description: "Type of transaction (debit/credit)"
                }
              }
            }
          }
        }
      }
    },
    receipt: {
      name: "receipt_schema",
      schema: {
        type: "object",
        properties: {
          merchant_name: {
            type: "string",
            description: "The name of the merchant or store"
          },
          receipt_date: {
            type: "string",
            description: "The date of the purchase"
          },
          receipt_time: {
            type: "string",
            description: "The time of the purchase"
          },
          receipt_number: {
            type: "string",
            description: "The receipt number or transaction ID"
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item_name: {
                  type: "string",
                  description: "The name of the purchased item"
                },
                item_price: {
                  type: "number",
                  description: "The price of the item"
                },
                item_quantity: {
                  type: "number",
                  description: "The quantity purchased"
                }
              }
            }
          },
          subtotal: {
            type: "number",
            description: "The subtotal before taxes"
          },
          tax_amount: {
            type: "number",
            description: "The tax amount"
          },
          total_amount: {
            type: "number",
            description: "The total amount paid"
          },
          payment_method: {
            type: "string",
            description: "The method of payment used"
          }
        }
      }
    }
  };

  const [currentSchema, setCurrentSchema] = useState(JSON.stringify(predefinedSchemas.invoice, null, 2));

  // Sample documents for demo
  const sampleDocuments = {
    invoice: {
      name: "Invoice Document",
      description: "Professional invoice with line items and customer details",
      content: `INVOICE #INV-2024-001
Date: July 2, 2024

Bill To:
John Smith
john.smith@email.com
+1 (555) 123-4567
123 Main St, City, State 12345

Items:
Product A - Qty: 2 - Price: $599.99 - Total: $1,199.98
Product B - Qty: 1 - Price: $700.00 - Total: $700.00

Subtotal: $1,899.98
Tax (8.5%): $161.50
Total: $2,061.48`
    },
    bank_statement: {
      name: "Bank Statement",
      description: "Monthly bank statement with transaction history",
      content: `BANK OF DREAM
Account: ****1234
Statement Period: June 1-30, 2024

Opening Balance: $5,250.00

Transactions:
06/03/2024 - Salary Deposit - $3,500.00 (Credit)
06/07/2024 - Rent Payment - $1,200.00 (Debit)
06/15/2024 - Grocery Store - $85.50 (Debit)
06/22/2024 - Gas Station - $45.00 (Debit)
06/28/2024 - Online Purchase - $125.75 (Debit)

Closing Balance: $7,394.75`
    },
    receipt: {
      name: "Store Receipt",
      description: "Retail receipt with itemized purchases",
      content: `SUPER MART
Receipt #R-2024-789
Date: 07/02/2024
Time: 14:30:15

Items:
Milk - $4.99
Bread - $3.49
Eggs - $5.99
Bananas - $2.99
Chicken Breast - $12.99

Subtotal: $30.45
Tax (8.5%): $2.59
Total: $33.04

Payment Method: Credit Card
Thank you for shopping!`
    }
  };

  const simulateSchemaGeneration = () => {
    setIsGeneratingSchema(true);
    setProcessingProgress(0);

    const stages = [
      { progress: 20, message: "Analyzing document structure..." },
      { progress: 40, message: "Identifying data patterns..." },
      { progress: 60, message: "Generating schema fields..." },
      { progress: 80, message: "Validating schema structure..." },
      { progress: 100, message: "Schema generation complete!" }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProcessingProgress(stages[currentStage].progress);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const generatedSchema = predefinedSchemas[selectedDocument as keyof typeof predefinedSchemas];
          setCurrentSchema(JSON.stringify(generatedSchema, null, 2));
          setIsGeneratingSchema(false);
          setProcessingProgress(0);
        }, 500);
      }
    }, 600);
  };

  const simulateExtraction = () => {
    setIsExtracting(true);
    setProcessingProgress(0);

    const stages = [
      { progress: 15, message: "Uploading document..." },
      { progress: 30, message: "Analyzing document content..." },
      { progress: 50, message: "Applying schema extraction..." },
      { progress: 75, message: "Validating extracted data..." },
      { progress: 90, message: "Structuring output..." },
      { progress: 100, message: "Extraction complete!" }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProcessingProgress(stages[currentStage].progress);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setExtractedData(generateRealisticExtractionResult());
          setIsExtracting(false);
          setProcessingProgress(0);
        }, 500);
      }
    }, 700);
  };

  const generateRealisticExtractionResult = (): ExtractionResult => {
    const schema = JSON.parse(currentSchema);
    let extractedData: Record<string, any> = {};

    if (selectedDocument === 'invoice') {
      extractedData = {
        invoice_number: "INV-2024-001",
        invoice_date: "2024-07-02",
        customer_name: "John Smith",
        customer_email: "john.smith@email.com",
        customer_phone: "+1 (555) 123-4567",
        customer_address: "123 Main St, City, State 12345",
        items: [
          {
            item_name: "Product A",
            quantity: 2,
            unit_price: 599.99,
            total_price: 1199.98
          },
          {
            item_name: "Product B",
            quantity: 1,
            unit_price: 700.00,
            total_price: 700.00
          }
        ],
        subtotal: 1899.98,
        tax_amount: 161.50,
        total_amount: 2061.48
      };
    } else if (selectedDocument === 'bank_statement') {
      extractedData = {
        bank_name: "Bank of Dream",
        account_number: "****1234",
        statement_period: "June 1-30, 2024",
        opening_balance: 5250.00,
        closing_balance: 7394.75,
        transactions: [
          {
            transaction_date: "2024-06-03",
            transaction_description: "Salary Deposit",
            transaction_amount: 3500.00,
            transaction_type: "credit"
          },
          {
            transaction_date: "2024-06-07",
            transaction_description: "Rent Payment",
            transaction_amount: 1200.00,
            transaction_type: "debit"
          },
          {
            transaction_date: "2024-06-15",
            transaction_description: "Grocery Store",
            transaction_amount: 85.50,
            transaction_type: "debit"
          },
          {
            transaction_date: "2024-06-22",
            transaction_description: "Gas Station",
            transaction_amount: 45.00,
            transaction_type: "debit"
          },
          {
            transaction_date: "2024-06-28",
            transaction_description: "Online Purchase",
            transaction_amount: 125.75,
            transaction_type: "debit"
          }
        ]
      };
    } else if (selectedDocument === 'receipt') {
      extractedData = {
        merchant_name: "Super Mart",
        receipt_date: "2024-07-02",
        receipt_time: "14:30:15",
        receipt_number: "R-2024-789",
        items: [
          {
            item_name: "Milk",
            item_price: 4.99,
            item_quantity: 1
          },
          {
            item_name: "Bread",
            item_price: 3.49,
            item_quantity: 1
          },
          {
            item_name: "Eggs",
            item_price: 5.99,
            item_quantity: 1
          },
          {
            item_name: "Bananas",
            item_price: 2.99,
            item_quantity: 1
          },
          {
            item_name: "Chicken Breast",
            item_price: 12.99,
            item_quantity: 1
          }
        ],
        subtotal: 30.45,
        tax_amount: 2.59,
        total_amount: 33.04,
        payment_method: "Credit Card"
      };
    }

    return {
      data: extractedData,
      schema: schema,
      processingTime: 2.8,
      fileInfo: {
        name: `${selectedDocument}_document.pdf`,
        size: "1.8 MB",
        type: "application/pdf"
      },
      usage: {
        prompt_tokens: 1247,
        completion_tokens: 156,
        total_tokens: 1403
      }
    };
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use the selected document type
      simulateExtraction();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = (format: 'json' | 'schema') => {
    if (!extractedData) return;
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    if (format === 'json') {
      content = JSON.stringify(extractedData.data, null, 2);
      filename = 'extracted_data.json';
      mimeType = 'application/json';
    } else {
      content = JSON.stringify(extractedData.schema, null, 2);
      filename = 'extraction_schema.json';
      mimeType = 'application/json';
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
    <section id="information-extractor" className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Universal Information Extractor</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Extract structured information from any document type using schema-based processing. 
            Works with complex PDFs, scanned images, and Microsoft Office documents without fine-tuning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Schema & Document */}
          <div className="space-y-6">
            {/* Schema Definition */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Schema Definition
                </CardTitle>
                <CardDescription>
                  Define the structure of data you want to extract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual Schema</TabsTrigger>
                    <TabsTrigger value="auto">Auto Generate</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Document Type</label>
                        <select 
                          value={selectedDocument}
                          onChange={(e) => {
                            setSelectedDocument(e.target.value);
                            const schema = predefinedSchemas[e.target.value as keyof typeof predefinedSchemas];
                            setCurrentSchema(JSON.stringify(schema, null, 2));
                          }}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="invoice">Invoice</option>
                          <option value="bank_statement">Bank Statement</option>
                          <option value="receipt">Receipt</option>
                        </select>
                      </div>
                      <Textarea
                        value={currentSchema}
                        onChange={(e) => setCurrentSchema(e.target.value)}
                        rows={15}
                        className="font-mono text-xs"
                        placeholder="Define your JSON schema..."
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="auto" className="mt-4">
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <Wand2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="font-medium mb-2">Automatic Schema Generation</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload up to 3 sample documents and let AI generate the optimal schema
                        </p>
                        <Button 
                          onClick={simulateSchemaGeneration} 
                          disabled={isGeneratingSchema}
                          className="w-full"
                        >
                          {isGeneratingSchema ? (
                            <>
                              <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                              Generating Schema...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Schema
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Document Upload
                </CardTitle>
                <CardDescription>
                  Upload your document for information extraction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={handleFileUpload}
                >
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Drop your document here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Supports PDF, PNG, JPG, DOCX, PPTX, XLSX (max 50MB)
                  </p>
                  <Button disabled={isExtracting}>
                    {isExtracting ? "Processing..." : "Choose File"}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.bmp,.tiff,.heic,.docx,.pptx,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Sample Document Preview */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Sample Document
                </CardTitle>
                <CardDescription>
                  Preview of the document being processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/30 p-4 rounded-lg text-sm border max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {sampleDocuments[selectedDocument as keyof typeof sampleDocuments].content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {isExtracting && (
              <Card className="bg-gradient-card border-0 shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCw className="w-5 h-5 animate-spin" />
                    Extracting Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={processingProgress} className="mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing document content and applying schema extraction...
                  </p>
                </CardContent>
              </Card>
            )}

            {extractedData && (
              <>
                {/* Extraction Results */}
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing Time: {extractedData.processingTime}s</span>
                        <span>Tokens: {extractedData.usage.total_tokens}</span>
                      </div>
                      
                      <Tabs defaultValue="formatted" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="formatted">Formatted</TabsTrigger>
                          <TabsTrigger value="json">JSON</TabsTrigger>
                          <TabsTrigger value="schema">Schema</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="formatted" className="mt-4">
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {Object.entries(extractedData.data).map(([key, value]) => (
                              <div key={key} className="bg-secondary/50 p-3 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-muted-foreground">{key}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {typeof value}
                                  </Badge>
                                </div>
                                <div className="font-mono text-sm">
                                  {Array.isArray(value) ? (
                                    <div className="space-y-2">
                                      {value.map((item, index) => (
                                        <div key={index} className="pl-4 border-l-2 border-primary/20">
                                          {typeof item === 'object' ? (
                                            Object.entries(item).map(([subKey, subValue]) => (
                                              <div key={subKey} className="text-xs">
                                                <span className="text-muted-foreground">{subKey}:</span> {String(subValue)}
                                              </div>
                                            ))
                                          ) : (
                                            String(item)
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    String(value)
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="json" className="mt-4">
                          <div className="bg-secondary/30 p-4 rounded-lg max-h-96 overflow-y-auto">
                            <pre className="text-xs font-mono whitespace-pre-wrap">
                              {JSON.stringify(extractedData.data, null, 2)}
                            </pre>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="schema" className="mt-4">
                          <div className="bg-secondary/30 p-4 rounded-lg max-h-96 overflow-y-auto">
                            <pre className="text-xs font-mono whitespace-pre-wrap">
                              {JSON.stringify(extractedData.schema, null, 2)}
                            </pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <div className="flex gap-2 pt-4 border-t">
                        <Button size="sm" onClick={() => downloadResult('json')}>
                          <Download className="w-4 h-4 mr-2" />
                          Download JSON
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => downloadResult('schema')}>
                          <FileCode className="w-4 h-4 mr-2" />
                          Download Schema
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyToClipboard(JSON.stringify(extractedData.data, null, 2))}
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Extraction Button */}
                <Card className="bg-gradient-card border-0 shadow-medium">
                  <CardContent className="pt-6">
                    <Button 
                      onClick={simulateExtraction} 
                      disabled={isExtracting}
                      className="w-full"
                      size="lg"
                    >
                      {isExtracting ? (
                        <>
                          <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                          Extracting Information...
                        </>
                      ) : (
                        <>
                          <Scan className="w-4 h-4 mr-2" />
                          Extract Information
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Schema-Agnostic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Process any document type without predefined templates or fine-tuning requirements.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Works with any document format
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    No training required
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Dynamic schema processing
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Hidden Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Extract not only explicit information but also implied or inferred values from documents.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Implied value detection
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Contextual understanding
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Intelligent data inference
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Auto Schema Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Automatically generate optimal schemas from sample documents using AI.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    AI-powered schema creation
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Up to 3 sample documents
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    JSON Schema compliant
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

export default InformationExtractorDemo;