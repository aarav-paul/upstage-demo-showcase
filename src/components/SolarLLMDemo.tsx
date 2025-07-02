import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, FileText, Brain } from "lucide-react";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SolarLLMDemo = () => {
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I can answer questions about the uploaded document. What would you like to know?'
    }
  ]);

  const sampleQuestions = [
    "What is the total amount in this invoice?",
    "Who is the customer?",
    "What products were purchased?",
    "When was this document created?"
  ];

  const handleAsk = (q?: string) => {
    const queryText = q || question;
    if (!queryText.trim()) return;

    setIsProcessing(true);
    const newMessages = [...messages, { role: 'user' as const, content: queryText }];
    setMessages(newMessages);
    setQuestion("");

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      if (queryText.toLowerCase().includes('total') || queryText.toLowerCase().includes('amount')) {
        response = "Based on the document analysis, the total amount is $1,299.99. This includes Product A ($599.99) and Product B ($700.00).";
      } else if (queryText.toLowerCase().includes('customer') || queryText.toLowerCase().includes('who')) {
        response = "The customer is John Smith, with email john.smith@email.com and phone number +1 (555) 123-4567. His address is listed as 123 Main St, City, State 12345.";
      } else if (queryText.toLowerCase().includes('product')) {
        response = "Two products were purchased: Product A for $599.99 and Product B for $700.00. The invoice shows these items with individual pricing.";
      } else if (queryText.toLowerCase().includes('when') || queryText.toLowerCase().includes('date')) {
        response = "This document was created on July 2, 2024, as indicated by the invoice date.";
      } else {
        response = "I can help answer questions about the document content. Try asking about specific details like amounts, dates, customer information, or products.";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <section id="solar-llm" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Solar LLM</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience general-purpose reasoning and contextual understanding for document-based Q&A. 
            Ask any question about the document and get intelligent responses.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Context
              </CardTitle>
              <CardDescription>
                The document being analyzed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/30 p-4 rounded-lg text-sm border">
                <div className="font-semibold mb-2">📄 Invoice Document Loaded</div>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <div>• Customer: John Smith</div>
                  <div>• Email: john.smith@email.com</div>
                  <div>• Total: $1,299.99</div>
                  <div>• Date: July 2, 2024</div>
                  <div>• Products: 2 items</div>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-sm">Try these questions:</h4>
                <div className="space-y-2">
                  {sampleQuestions.map((q, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 text-xs"
                      onClick={() => handleAsk(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Conversation
              </CardTitle>
              <CardDescription>
                Chat with Solar LLM about the document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 h-80 overflow-y-auto mb-4 p-4 bg-secondary/20 rounded-lg">
                {messages.map((message, i) => (
                  <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border shadow-sm'
                    }`}>
                      <div className="text-sm">{message.content}</div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-card border p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-muted-foreground">Thinking...</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question about the document..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  disabled={isProcessing}
                />
                <Button onClick={() => handleAsk()} disabled={isProcessing || !question.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SolarLLMDemo;