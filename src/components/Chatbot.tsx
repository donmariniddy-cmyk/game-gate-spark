import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import wrxIcon from "@/assets/wrx-chatbot-icon.png";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey there! 🎮 Welcome to **NAAMS Play**! I'm your gaming assistant. How can I help you today? Ask me anything about our games, pricing, or how to get access!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg].filter((m) => m.role === "user" || m.role === "assistant");

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to connect");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user" && prev[prev.length - 2]?.content === text) {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again or contact us on WhatsApp: +255 693 711 597 🎮" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating WRX button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full overflow-hidden shadow-[0_0_25px_rgba(0,100,255,0.6)] hover:shadow-[0_0_40px_rgba(0,100,255,0.9)] transition-all hover:scale-110 ring-2 ring-blue-500/60"
          aria-label="Open chat"
          style={{ animation: "wrx-pulse 2s ease-in-out infinite" }}
        >
          <img src={wrxIcon} alt="Chat with us" className="w-full h-full object-cover" />
        </button>
      )}

      {/* Chat window - WRX themed */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[370px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,100,255,0.4)] border border-blue-500/30"
          style={{ background: "linear-gradient(180deg, hsl(220 30% 8%) 0%, hsl(220 25% 5%) 100%)" }}
        >
          {/* Header - WRX racing style */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: "linear-gradient(135deg, hsl(220 80% 25%) 0%, hsl(220 90% 15%) 100%)", borderBottom: "2px solid hsl(45 100% 50%)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-yellow-400/70 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                <img src={wrxIcon} alt="WRX Assistant" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-heading font-bold text-sm tracking-wider text-white block leading-tight">NAAMS Play</span>
                <span className="text-[10px] tracking-widest text-yellow-400/80 font-medium">⚡ ONLINE NOW</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors" aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "linear-gradient(180deg, hsl(220 25% 7%) 0%, hsl(220 20% 4%) 100%)" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0 ring-1 ring-blue-500/40">
                    <img src={wrxIcon} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-sm text-white"
                      : "rounded-bl-sm text-blue-50/90"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg, hsl(220 80% 35%) 0%, hsl(220 90% 25%) 100%)", border: "1px solid hsl(45 100% 50% / 0.3)" }
                      : { background: "hsl(220 20% 12%)", border: "1px solid hsl(220 40% 20%)" }
                  }
                >
                  {renderText(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0 ring-1 ring-blue-500/40">
                  <img src={wrxIcon} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="px-3 py-2 rounded-xl rounded-bl-sm" style={{ background: "hsl(220 20% 12%)", border: "1px solid hsl(220 40% 20%)" }}>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                </div>
              </div>
            )}
          </div>

          {/* Input - racing stripe accent */}
          <div className="p-3 flex gap-2" style={{ borderTop: "2px solid hsl(45 100% 50% / 0.4)", background: "hsl(220 25% 8%)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask me anything..."
              className="flex-1 text-sm rounded-lg px-3 py-2 outline-none text-white placeholder:text-blue-300/40"
              style={{ background: "hsl(220 20% 12%)", border: "1px solid hsl(220 40% 20%)" }}
            />
            <button
              onClick={send}
              disabled={isLoading || !input.trim()}
              className="rounded-lg px-3 py-2 disabled:opacity-40 transition-all text-white hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]"
              style={{ background: "linear-gradient(135deg, hsl(220 80% 35%) 0%, hsl(220 90% 25%) 100%)", border: "1px solid hsl(45 100% 50% / 0.4)" }}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wrx-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,100,255,0.5), 0 0 40px rgba(0,100,255,0.2); }
          50% { box-shadow: 0 0 30px rgba(0,100,255,0.8), 0 0 60px rgba(0,100,255,0.4); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
