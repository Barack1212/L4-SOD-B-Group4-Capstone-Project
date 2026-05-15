import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, HelpCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CROPS, FARMING_TIPS } from "@/lib/farming-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/ask-me")({
  component: AskMePage,
  head: () => ({
    meta: [
      { title: "Ask AI · Smart Farming Rwanda" },
      {
        name: "description",
        content: "Ask our AI assistant any questions about farming, crops, and best practices.",
      },
    ],
  }),
});

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What is the best time to plant Maize?",
  "How do I control potato blight naturally?",
  "Tell me about Season A (Umuhindo)",
  "What crops need low irrigation?",
];

function AskMePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Muraho! I am your Smart Farming Assistant. Ask me anything about crops, planting seasons, or farming tips in Rwanda. How can I help you grow today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  function simulateAIResponse(userMessage: string) {
    const text = userMessage.toLowerCase();
    let response = "I'm not quite sure about that. Could you ask about a specific crop (like maize, beans, coffee) or general farming seasons?";

    // Match crops
    const mentionedCrop = CROPS.find((c) => text.includes(c.name.toLowerCase()) || text.includes(c.id));
    
    if (mentionedCrop) {
      response = `${mentionedCrop.emoji} **${mentionedCrop.name}** is an excellent choice!\n\n**Best Seasons:** ${mentionedCrop.bestSeasons.join(" and ")} (${mentionedCrop.months}).\n**Water Need:** ${mentionedCrop.waterNeed}.\n\n**Expert Tip:** ${mentionedCrop.notes}`;
    } else if (text.includes("tip") || text.includes("advice") || text.includes("help")) {
      const tip = FARMING_TIPS[Math.floor(Math.random() * FARMING_TIPS.length)];
      response = `Here is a useful tip for you: **${tip.title}**\n\n${tip.body}`;
    } else if (text.includes("season") || text.includes("when to plant")) {
      response = "Rwanda generally has 4 agricultural seasons:\n\n1. **Itumba** (Long rains: Feb-May)\n2. **Impeshyi** (Long dry: Jun-Aug)\n3. **Umuhindo** (Short rains: Sep-Nov)\n4. **Urugaryi** (Short dry: Dec-Jan)\n\nThe best planting seasons for most staple crops are Itumba and Umuhindo.";
    } else if (text.includes("potato blight") || text.includes("disease") || text.includes("pest")) {
      response = "For potato blight (Late Blight), it's crucial to act early, especially during the rainy season. \n\n1. Use certified disease-free seeds.\n2. Ensure proper spacing for airflow.\n3. Apply copper-based organic fungicides preemptively if heavy rains are expected.";
    }

    return response;
  }

  function handleSendText(text: string) {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = simulateAIResponse(userMsg.content);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponse,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); 
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    handleSendText(input);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      
      <motion.main 
        className="container mx-auto flex flex-1 flex-col px-4 py-8 max-w-5xl"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-inner">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground md:text-5xl tracking-tight mb-3">AI Agronomist</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Your personal, intelligent assistant for Rwandan agriculture. Ask about crop suitability, seasons, or disease control.
          </p>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" /> Frequently Asked
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {SUGGESTED_QUESTIONS.map((sq) => (
                <button
                  key={sq}
                  onClick={() => handleSendText(sq)}
                  className="rounded-full border border-border/60 bg-card/50 px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary shadow-sm"
                >
                  {sq}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat Interface */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-xl" style={{ minHeight: "500px", maxHeight: "65vh" }}>
          
          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 md:p-8 scroll-smooth">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-green-500 to-primary text-white"}`}>
                  {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`rounded-3xl px-6 py-4 max-w-[90%] md:max-w-[80%] shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-background border border-border/50 text-foreground rounded-tl-sm"}`}>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex gap-4 flex-row"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-primary text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-3xl px-6 py-5 bg-background border border-border/50 rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-border/50 bg-background/50 p-4 md:p-6 backdrop-blur-md">
            <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about crops, seasons, or farming tips..."
                className="w-full rounded-full border border-border/50 bg-card px-6 py-4 pr-16 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground shadow-inner"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 h-11 w-11 rounded-full bg-primary hover:bg-primary/90 shadow-md"
              >
                {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
              </Button>
            </form>
            <p className="mt-3 text-center text-[12px] text-muted-foreground font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" /> AI responses are generated based on Rwandan agricultural data. Verify critical information.
            </p>
          </div>
        </div>
      </motion.main>
      
      <SiteFooter />
    </div>
  );
}
