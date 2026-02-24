"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const PROMPT_PROBES = [
  "What is this platform?",
  "What are the pricing plans?",
  "How can I monetize my community?",
  "What features does the AI assistant offer?",
  "Which plan is best for creators?",
  "How do I get started for free?",
  "What use cases does this support?",
];

export default function ChatWidget() {
  const pathname = usePathname();
  const communitySlug = pathname?.match(/^\/communities\/([^/]+)/)?.[1];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          ...(communitySlug && { communitySlug }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          err instanceof Error
            ? err.message
            : "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleProbeClick = (probe: string) => {
    sendMessage(probe);
  };

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-20 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-300 ease-out ${
          isOpen
            ? "h-[420px] w-[380px] opacity-100 sm:h-[480px] sm:w-[400px]"
            : "pointer-events-none h-0 w-0 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100">
              <svg
                className="h-5 w-5 text-violet-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Platform Guide</h3>
              <p className="text-xs text-slate-500">Ask me anything about the platform</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
            aria-label="Close chat"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-violet-50 px-4 py-3 text-sm">
                <p className="font-medium text-slate-900">Hi! I&apos;m your platform guide.</p>
                <p className="mt-1 text-slate-600">
                  Ask me about features, pricing, use cases, or how to get started. Try one of the suggestions below:
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500">Suggested questions</p>
                <div className="flex flex-col gap-2">
                  {PROMPT_PROBES.map((probe) => (
                    <button
                      key={probe}
                      onClick={() => handleProbeClick(probe)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-left text-sm text-slate-700 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                      {probe}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-violet-500 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-slate-100 px-4 py-2.5">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Quick probes when there are messages */}
        {messages.length > 0 && !isLoading && (
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-2">
            <div className="flex flex-wrap gap-2">
              {PROMPT_PROBES.slice(0, 3).map((probe) => (
                <button
                  key={probe}
                  onClick={() => handleProbeClick(probe)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  {probe}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask about the platform..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-accent text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-violet-500/35 active:scale-95"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
