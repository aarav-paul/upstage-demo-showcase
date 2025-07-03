import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageCircle, 
  Send, 
  FileText, 
  Brain, 
  Upload,
  Settings,
  Zap,
  Lightbulb,
  RotateCw,
  Copy,
  Download,
  CheckCircle,
  Sparkles,
  Cpu,
  Target
} from "lucide-react";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  reasoning_effort?: 'low' | 'medium' | 'high';
  tokens?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  processing_time?: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  content: string;
  summary: string;
}

const SolarLLMDemo = () => {
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [reasoningEffort, setReasoningEffort] = useState<'low' | 'medium' | 'high'>('high');
  const [showThinking, setShowThinking] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<string>("invoice");
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m Solar LLM with advanced reasoning capabilities. I can help you analyze documents, solve complex problems, and provide detailed explanations with my chain-of-thought reasoning. What would you like to explore?',
      reasoning_effort: 'high',
      tokens: { prompt_tokens: 25, completion_tokens: 45, total_tokens: 70 },
      processing_time: 1.2
    }
  ]);

  // Sample documents for demo
  const documents: Record<string, Document> = {
    invoice: {
      id: "doc_001",
      name: "Invoice Document",
      type: "invoice",
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
Total: $2,061.48

Payment Terms: Net 30
Due Date: August 1, 2024`,
      summary: "Professional invoice with customer details, line items, and payment terms"
    },
    research: {
      id: "doc_002", 
      name: "Research Paper",
      type: "academic",
      content: `Machine Learning Performance Analysis
Authors: Dr. Sarah Chen, Prof. Michael Rodriguez
Published: June 2024

Abstract:
This study examines the performance of three machine learning algorithms (Random Forest, SVM, and Neural Networks) on a dataset of 10,000 samples with 50 features. Our results show that Random Forest achieved 94.2% accuracy, SVM achieved 91.8%, and Neural Networks achieved 93.7%.

Key Findings:
- Random Forest performed best overall
- SVM was fastest in training time
- Neural Networks showed best generalization
- Feature importance analysis revealed 5 critical features

Conclusion:
Random Forest is recommended for this type of classification task due to its superior accuracy and interpretability.`,
      summary: "Academic research paper on machine learning algorithm comparison"
    },
    financial: {
      id: "doc_003",
      name: "Financial Report",
      type: "financial", 
      content: `Q2 2024 Financial Performance Report
Company: TechCorp Industries
Period: April 1 - June 30, 2024

Revenue Analysis:
- Q2 Revenue: $2.5M (↑15% vs Q1)
- Product Sales: $1.8M (72% of total)
- Service Revenue: $0.7M (28% of total)

Expense Breakdown:
- R&D: $0.6M (24% of revenue)
- Marketing: $0.4M (16% of revenue)
- Operations: $0.3M (12% of revenue)
- Admin: $0.2M (8% of revenue)

Net Profit: $1.0M (40% margin)
Cash Position: $3.2M (↑$0.7M from Q1)

Outlook: Projecting 20% growth in Q3 based on current pipeline.`,
      summary: "Quarterly financial report with revenue, expenses, and projections"
    }
  };

  // Sample questions for different document types
  const sampleQuestions = {
    invoice: [
      "What is the total amount and when is it due?",
      "Calculate the tax rate used in this invoice",
      "What are the payment terms and customer details?",
      "How much would the total be if we added 10% discount?"
    ],
    research: [
      "Which algorithm performed best and why?",
      "What were the key findings of this study?",
      "How many samples and features were used?",
      "What is the main recommendation and its reasoning?"
    ],
    financial: [
      "What was the revenue growth from Q1 to Q2?",
      "Calculate the profit margin and cash increase",
      "What percentage of revenue goes to R&D?",
      "What is the projected growth for Q3?"
    ]
  };

  const getReasoningEffortDescription = (effort: string) => {
    switch (effort) {
      case 'low': return 'Quick responses with minimal reasoning';
      case 'medium': return 'Balanced reasoning and response time';
      case 'high': return 'Detailed chain-of-thought analysis';
      default: return 'Default reasoning level';
    }
  };

  const getReasoningEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const simulateStreamingResponse = async (query: string, effort: 'low' | 'medium' | 'high') => {
    const newMessages = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMessages);
    setQuestion("");
    setIsProcessing(true);

    // Generate realistic response based on document and query
    const response = generateRealisticResponse(query, effort);
    const thinking = generateThinkingProcess(query, effort);
    
    // Simulate streaming response
    let currentResponse = "";
    const responseWords = response.split(' ');
    
    for (let i = 0; i < responseWords.length; i++) {
      currentResponse += responseWords[i] + ' ';
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: currentResponse.trim(),
          thinking: thinking,
          reasoning_effort: effort,
          tokens: {
            prompt_tokens: Math.floor(Math.random() * 50) + 100,
            completion_tokens: Math.floor(Math.random() * 100) + 150,
            total_tokens: Math.floor(Math.random() * 150) + 250
          },
          processing_time: Math.random() * 2 + 1
        }
      ]);
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
    
    setIsProcessing(false);
  };

  const generateRealisticResponse = (query: string, effort: string): string => {
    const doc = documents[selectedDocument];
    const queryLower = query.toLowerCase();
    
    if (selectedDocument === 'invoice') {
      if (queryLower.includes('total') && queryLower.includes('due')) {
        return "The total amount is $2,061.48 and it's due on August 1, 2024. The invoice shows a subtotal of $1,899.98, with $161.50 in taxes (8.5% rate), bringing the total to $2,061.48. The payment terms are Net 30, meaning payment is due 30 days from the invoice date of July 2, 2024.";
      } else if (queryLower.includes('tax rate')) {
        return "The tax rate used in this invoice is 8.5%. This can be calculated by dividing the tax amount ($161.50) by the subtotal ($1,899.98), which equals 0.085 or 8.5%.";
      } else if (queryLower.includes('payment terms') || queryLower.includes('customer')) {
        return "The payment terms are Net 30, meaning payment is due within 30 days. The customer is John Smith with email john.smith@email.com, phone +1 (555) 123-4567, and address 123 Main St, City, State 12345.";
      } else if (queryLower.includes('discount')) {
        return "If we apply a 10% discount to the subtotal of $1,899.98, the discount would be $189.998. The new subtotal would be $1,709.982, and with 8.5% tax ($145.35), the new total would be $1,855.33.";
      }
    } else if (selectedDocument === 'research') {
      if (queryLower.includes('algorithm') && queryLower.includes('best')) {
        return "Random Forest performed best with 94.2% accuracy, followed by Neural Networks at 93.7%, and SVM at 91.8%. Random Forest likely performed best due to its ensemble nature, which reduces overfitting and handles the 50 features well. It also provides good interpretability through feature importance analysis.";
      } else if (queryLower.includes('key findings')) {
        return "The key findings include: 1) Random Forest achieved the highest accuracy at 94.2%, 2) SVM was the fastest in training time, 3) Neural Networks showed the best generalization, and 4) Feature importance analysis revealed 5 critical features that significantly impact performance.";
      } else if (queryLower.includes('samples') || queryLower.includes('features')) {
        return "The study used a dataset of 10,000 samples with 50 features. This is a substantial dataset size that provides good statistical power for comparing the three machine learning algorithms.";
      } else if (queryLower.includes('recommendation')) {
        return "The main recommendation is to use Random Forest for this type of classification task. This recommendation is based on its superior accuracy (94.2%), good interpretability through feature importance analysis, and the fact that it handles the 50 features effectively without overfitting.";
      }
    } else if (selectedDocument === 'financial') {
      if (queryLower.includes('growth') || queryLower.includes('q1')) {
        return "Revenue grew 15% from Q1 to Q2, increasing from approximately $2.17M to $2.5M. This represents a $0.33M increase in quarterly revenue, showing strong business performance.";
      } else if (queryLower.includes('margin') || queryLower.includes('cash')) {
        return "The profit margin is 40% ($1.0M net profit on $2.5M revenue). Cash position increased by $0.7M from Q1, reaching $3.2M total. This indicates strong cash flow management and profitability.";
      } else if (queryLower.includes('r&d') || queryLower.includes('percentage')) {
        return "R&D spending is $0.6M, which represents 24% of total revenue ($2.5M). This is a significant investment in research and development, showing the company's commitment to innovation.";
      } else if (queryLower.includes('q3') || queryLower.includes('projected')) {
        return "The company is projecting 20% growth in Q3 based on the current pipeline. This would represent an increase from $2.5M to approximately $3.0M in Q3 revenue if the projection holds true.";
      }
    }
    
    return "I can help analyze this document. Try asking specific questions about the content, calculations, or insights you'd like to explore. I can provide detailed reasoning and explanations for complex queries.";
  };

  const generateThinkingProcess = (query: string, effort: string): string => {
    if (effort === 'low') {
      return "Quick analysis: Direct answer based on document content.";
    } else if (effort === 'medium') {
      return "Let me analyze the key information from the document to provide a comprehensive answer.";
    } else {
      return `Let me break this down step by step:

1. First, I need to understand what the user is asking for
2. I'll identify the relevant information in the document
3. I'll perform any necessary calculations or analysis
4. I'll consider the context and implications
5. Finally, I'll provide a clear, detailed response

This approach ensures I give the most accurate and helpful answer possible.`;
    }
  };

  const handleAsk = (q?: string) => {
    const queryText = q || question;
    if (!queryText.trim()) return;
    simulateStreamingResponse(queryText, reasoningEffort);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use the selected document type
      simulateStreamingResponse("I've uploaded a new document. Can you analyze it?", reasoningEffort);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadConversation = () => {
    const conversation = messages.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.content}${msg.thinking ? '\n\nTHINKING:\n' + msg.thinking : ''}`
    ).join('\n\n---\n\n');
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solar_llm_conversation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <section id="solar-llm" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Solar LLM</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Experience advanced reasoning with chain-of-thought processing. Solar LLM breaks down complex questions 
            into logical steps, validates assumptions, and provides detailed explanations with internal reasoning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Settings & Document */}
          <div className="space-y-6">
            {/* Reasoning Settings */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Reasoning Settings
                </CardTitle>
                <CardDescription>
                  Configure the AI's reasoning capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Reasoning Effort</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as const).map((effort) => (
                        <Button
                          key={effort}
                          variant={reasoningEffort === effort ? "default" : "outline"}
                          size="sm"
                          onClick={() => setReasoningEffort(effort)}
                          className="text-xs"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {effort.charAt(0).toUpperCase() + effort.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {getReasoningEffortDescription(reasoningEffort)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="show-thinking"
                      checked={showThinking}
                      onChange={(e) => setShowThinking(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="show-thinking" className="text-sm">
                      Show thinking process
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Context */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Document Context
                </CardTitle>
                <CardDescription>
                  Select a document to analyze
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(documents).map(([key, doc]) => (
                    <div
                      key={key}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDocument === key 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedDocument(key)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{doc.name}</div>
                        <Badge variant="secondary" className="text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{doc.summary}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={handleFileUpload}
                  >
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Upload your own document</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sample Questions */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Sample Questions
                </CardTitle>
                <CardDescription>
                  Try these questions to see reasoning in action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleQuestions[selectedDocument as keyof typeof sampleQuestions].map((q, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 text-xs"
                      onClick={() => handleAsk(q)}
                      disabled={isProcessing}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="space-y-6">
            {/* Chat Interface */}
            <Card className="bg-gradient-card border-0 shadow-medium h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Conversation
                </CardTitle>
                <CardDescription>
                  Chat with Solar LLM using advanced reasoning
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto mb-4 p-4 bg-secondary/20 rounded-lg">
                  {messages.map((message, i) => (
                    <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                        {message.role === 'assistant' && message.thinking && showThinking && (
                          <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Cpu className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-medium text-blue-800">Thinking Process</span>
                              <Badge className={getReasoningEffortColor(message.reasoning_effort || 'medium')}>
                                {message.reasoning_effort}
                              </Badge>
                            </div>
                            <div className="text-xs text-blue-700 whitespace-pre-wrap">
                              {message.thinking}
                            </div>
                          </div>
                        )}
                        
                        <div className={`p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-card border shadow-sm'
                        }`}>
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          
                          {message.role === 'assistant' && message.tokens && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                              <div className="text-xs text-muted-foreground">
                                Tokens: {message.tokens.total_tokens} • Time: {message.processing_time?.toFixed(1)}s
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(message.content)}
                                className="h-6 px-2 text-xs"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-card border p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <RotateCw className="w-4 h-4 animate-spin" />
                          Thinking with {reasoningEffort} reasoning effort...
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask a question or describe a problem..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    disabled={isProcessing}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleAsk()} 
                    disabled={isProcessing || !question.trim()}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Conversation Actions */}
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Button 
                    onClick={downloadConversation}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Conversation
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(messages.map(m => `${m.role}: ${m.content}`).join('\n\n'))}
                    variant="outline"
                    size="sm"
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Advanced Reasoning Features</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Chain-of-Thought
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Breaks down complex problems into logical steps with internal reasoning before responding.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Step-by-step reasoning
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Assumption validation
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Cross-reference data
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Reasoning Effort
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Adjustable reasoning levels from quick responses to detailed analysis.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Low: Quick responses
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Medium: Balanced analysis
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    High: Detailed reasoning
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Streaming Responses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Real-time streaming responses with visible thinking process and token tracking.
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Real-time streaming
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Token usage tracking
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Processing time metrics
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

export default SolarLLMDemo;