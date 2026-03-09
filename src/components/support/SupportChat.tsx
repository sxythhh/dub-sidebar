"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";
import { ThinkingIndicator } from "@/components/ui/thinking-indicator";

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/support/chat" }),
    []
  );

  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport,
  } as Parameters<typeof useChat>[0]);

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Log errors for debugging
  useEffect(() => {
    if (error) {
      console.error("[SupportChat] Error:", error);
    }
  }, [error]);

  const getMessageText = useCallback(
    (message: (typeof messages)[number]) => {
      if (!message.parts) return "";
      return message.parts
        .filter(
          (p): p is { type: "text"; text: string } => p.type === "text"
        )
        .map((p) => p.text)
        .join("");
    },
    []
  );

  const buildTranscript = useCallback(() => {
    return messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => {
        const text = getMessageText(m);
        return `${m.role === "user" ? "User" : "AI"}: ${text}`;
      })
      .filter((line) => !line.endsWith(": "))
      .join("\n");
  }, [messages, getMessageText]);

  const handleEscalateToHuman = () => {
    const transcript = buildTranscript();
    const firstUserMessage = messages.find((m) => m.role === "user");
    const userQuestion = firstUserMessage
      ? getMessageText(firstUserMessage)
      : "";
    const prefill = userQuestion
      ? `I was chatting with the AI assistant about: "${userQuestion.slice(0, 200)}"\n\nI need human help with:`
      : "";

    if ((window as any).Intercom) {
      if (transcript) {
        (window as any).Intercom("update", {
          custom_attributes: {
            ai_chat_transcript: transcript.slice(-2000),
            ai_chat_escalated_at: new Date().toISOString(),
          },
        });
      }
      (window as any).Intercom("showNewMessage", prefill);
    } else {
      // Fallback: open Intercom messenger directly
      window.open(
        `https://intercom.help/content-rewards/en`,
        "_blank"
      );
    }

    setIsOpen(false);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    sendMessage({ text });
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInputValue("");
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: "#ffffff", backgroundImage: "none" }}
          aria-label="Open support chat"
        >
          <MessageCircle className="h-5 w-5 text-gray-900" />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-5 right-5 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
          style={{ height: "min(600px, calc(100vh - 100px))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 dark:bg-white">
                <MessageCircle className="h-3.5 w-3.5 text-white dark:text-gray-900" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Support
                </p>
                <p className="text-xs text-gray-500 dark:text-neutral-500">
                  Ask anything about Content Rewards
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  aria-label="New conversation"
                  title="New conversation"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                  <MessageCircle className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    How can we help?
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                    Ask about campaigns, payouts, submissions, or anything
                    else.
                  </p>
                </div>
                <div className="mt-2 flex w-full max-w-[260px] flex-col gap-1.5">
                  {[
                    "How does CPM work?",
                    "How do I request a payout?",
                    "Why was my submission rejected?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setInputValue("");
                        sendMessage({ text: suggestion });
                      }}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-left text-xs text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((message) => {
                const text = getMessageText(message);
                if (!text) return null;
                return (
                  <div
                    key={message.id}
                    className={`mb-3 flex ${message.role === "user" ? "justify-end" : "items-start gap-2"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12.8333 6.66667C8.55093 6.66667 6.66667 8.55093 6.66667 12.8333C6.66667 8.55093 4.78241 6.66667 0.5 6.66667C4.78241 6.66667 6.66667 4.78241 6.66667 0.5C6.66667 4.78241 8.55093 6.66667 12.8333 6.66667Z"
                            className="stroke-gray-400 dark:stroke-neutral-500"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        message.role === "user"
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                          : "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200"
                      }`}
                    >
                      <MessageContent content={text} />
                    </div>
                  </div>
                );
              })}

            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="mb-3 flex items-start gap-2">
                  <div className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12.8333 6.66667C8.55093 6.66667 6.66667 8.55093 6.66667 12.8333C6.66667 8.55093 4.78241 6.66667 0.5 6.66667C4.78241 6.66667 6.66667 4.78241 6.66667 0.5C6.66667 4.78241 8.55093 6.66667 12.8333 6.66667Z"
                        className="stroke-gray-400 dark:stroke-neutral-500"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="rounded-2xl bg-gray-100 dark:bg-neutral-800">
                    <ThinkingIndicator className="text-gray-900 dark:text-neutral-200 [&_svg]:text-gray-400 dark:[&_svg]:text-neutral-500 [&_.shimmer-text]:!bg-[linear-gradient(90deg,#737373_0%,#737373_35%,#171717_50%,#737373_65%,#737373_100%)] dark:[&_.shimmer-text]:!bg-[linear-gradient(90deg,#a3a3a3_0%,#a3a3a3_35%,#525252_50%,#a3a3a3_65%,#a3a3a3_100%)]" />
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Escalate bar — shows after a few exchanges or when user/AI mentions human support */}
          {(messages.length >= 4 ||
            messages.some((m) => {
              const text = getMessageText(m).toLowerCase();
              return /\b(human|person|agent|someone|speak to|talk to|real person|support team|escalat|help center)\b/.test(text);
            })) && (
            <div className="border-t border-gray-100 px-4 py-2 dark:border-neutral-800">
              <button
                type="button"
                onClick={handleEscalateToHuman}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-300"
              >
                <span>Need a human? Talk to our team</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-3 dark:border-neutral-800">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-600 dark:focus:border-neutral-700"
                style={{ maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-30"
                style={{
                  backgroundColor: "#111111",
                  backgroundImage: "none",
                }}
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\)|\n)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part === "\n") return <br key={i} />;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {linkMatch[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
