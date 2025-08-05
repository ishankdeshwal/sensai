"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const bottomRef = useRef(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } = useChat({ 
    api: "/api/gemini" 
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showChatIcon) {
      setShowPopup(true);
      const timer = setTimeout(() => setShowPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showChatIcon]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (error) console.log("Chat error:", error);

  return (
    <>
      {/* Chat Icon */}
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={toggleChat}
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            
            {/* Popup */}
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-16 right-0 bg-background border rounded-lg p-3 shadow-lg max-w-xs"
              >
                <p className="text-sm text-muted-foreground">
                  Need help? Chat with our AI assistant!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-[80%] md:w-[500px]"
          >
            <Card className="border-2 shadow-xl">
              <CardHeader className="flex flex-row space-y-0 pb-3 items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  Chat with{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-700 text-transparent bg-clip-text">
                    CarrerGenie
                  </span>
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={toggleChat}
                  size="icon"
                  className="rounded-full px-2 py-0 shadow-lg"
                >
                  <X className="size-4" />
                  <span className="sr-only">Close Chat</span>
                </Button>
              </CardHeader>
              
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center gap-3 text-gray-500 mt-32">
                      <MessageCircle className="h-5 w-5" />
                      <span>Ask me anything about your career!</span>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`inline-block max-w-[80%] ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        } rounded-lg p-3`}
                      >
                        <ReactMarkdown
                          children={msg.content}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ inline, children, ...props }) {
                              return inline ? (
                                <code className="bg-gray-200 px-1 rounded text-sm">
                                  {children}
                                </code>
                              ) : (
                                <pre className="bg-gray-200 p-2 rounded text-sm overflow-x-auto" {...props}>
                                  <code>{children}</code>
                                </pre>
                              );
                            },
                            ul: ({ children }) => (
                              <ul className="list-disc ml-4 space-y-1">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal ml-4 space-y-1">{children}</ol>
                            ),
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center justify-center gap-3 py-4">
                      <Loader2 className="animate-spin h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                      <button
                        className="text-sm underline text-muted-foreground hover:text-primary"
                        type="button"
                        onClick={() => stop()}
                      >
                        Stop
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center justify-center gap-3 py-4">
                      <span className="text-sm text-red-500">An error occurred</span>
                      <button
                        className="text-sm underline text-primary hover:text-primary/80"
                        type="button"
                        onClick={() => reload()}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </ScrollArea>
              </CardContent>
              
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1"
                    placeholder="Type your message here..."
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    className="size-9"
                    disabled={isLoading || !input.trim()}
                    size="icon"
                  >
                    <Send className="size-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 