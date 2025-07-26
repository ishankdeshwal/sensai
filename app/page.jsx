"use client"
import HeroSection from "@/components/HeroSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,

  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { faqs } from "@/data/faqs";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  MessageCircle,
  Send,
  Loader2,
  ArrowDownCircleIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@ai-sdk/react"
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import remarkGfm from "remark-gfm";
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [isChatOpen, setIsCharOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const chatIconRef = useRef(null)
  const bottomRef = useRef(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } = useChat({ api: "/api/gemini" })
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsCharOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
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
  if (error) console.log("error", error);
  const toggleChat = () => {
    setIsCharOpen(!isChatOpen)
   
  }
  return (
    <div>
      <div className="grid-background"></div>
      <HeroSection />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            {" "}
            Powerful Features for Your Career Growth
          </h2>
          <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              return (
                <Card
                  key={index}
                  className="border-2 hover:border-primary transition-colors duration-300"
                >
                  <CardContent className="pt-6 text-center flex flex-col items-center ">
                    <div className="flex items-center flex-col justify-center ">
                      {feature.icon}
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24  bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">50+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">1000+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">95% </h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold">24/7 </h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground">
              Four Simple Steps to accelerate your carrer growth
            </p>
          </div>
          <div className="grid  md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            what our users say
          </h2>
          <div className="grid  md:grid-cols-3  gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => {
              return (
                <Card key={index} className="bg-background">
                  <CardContent className="pt-6">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            className="rounded-full object-cover border-2 border-priamary/20"
                            width={40}
                            height={40}
                            src={testimonial.image}
                            alt={testimonial.author}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                          <p className="text-sm text-primary">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                      <blockquote>
                        <p className="text-muted-foreground italic relative">
                          <span className="text-3xl text-primary absolute -top-4 -left-2">
                            &quot;
                          </span>
                          {testimonial.quote}
                          <span className="text-3xl text-primary absolute -bottom-4">
                            &quot;
                          </span>
                        </p>
                      </blockquote>
                      <div></div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find answers to common questions on our platform
            </p>
          </div>
          <div className=" max-w-6xl mx-auto cursor-pointer">
            <Accordion type="single" collapsible>
              {faqs.map((item, index) => {
                return (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>
      <section className="w-full">
        <div className=" mx-auto py-24 gradient-bg rounded-lg ">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to accelerate your career?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Join thousands of professionals who are advancing their careers with AI-powered guidance.
            </p>
            <Link href='/dashboard' passHref>
              <Button size='lg' variant='secondary' className='h-11 mt-5 animate-bounce' >
                Start your journey today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed  bottom-0 mb-5 mr-5 right-0 z-50 w-14 h-14 rounded-full bg-background/80 "
          >
            <AnimatePresence>
              {showPopup && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1 -left-40 bg-primary text-primary-foreground text-sm px-3 py-2 rounded-lg  text-center"                >
                  <div>
                    Need help?<br />Chat with <span className="bg-gradient-to-r from-cyan-400 to-blue-700 text-transparent bg-clip-text">Geniee!</span>
                  </div>                </motion.div>
              )}
            </AnimatePresence>

            <Button ref={chatIconRef} onClick={toggleChat} size="icon" className='w-12 rounded-full h-12  '>
              {!isChatOpen ? (<MessageCircle className="size-12 p-1" />) : (<ArrowDownCircleIcon className="size-12 p-1" />)}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed  bottom-20  right-15 z-50 w-[80%] md:w-[500px] "
          >
            <Card className='border-2'>
              <CardHeader className='flex flex-row space-y-0 pb-3 items-center justify-between'>
                <CardTitle className='text-lg font-bold '>
                  Chat With <span  className="bg-gradient-to-r from-cyan-400 to-blue-700 text-transparent bg-clip-text">CarrierGeniee</span> 
                </CardTitle>
                <Button variant='ghost' onClick={toggleChat} size='icon' className='rounded-full px-2 py-0 shadow-lg'>
                  <X className="size-4 " />
                  <span className="sr-only">Close Chat</span>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {messages.length === 0 && (
                    <div className=" bg-gradient-to-r from-cyan-400 to-blue-700 text-transparent bg-clip-text w-full mt-32  text-gray-500 items-center justify-center flex gap-3">
                      Ask me out something..
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
                    >
                      <div
                        className={`inline-block ${msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                          } rounded p-2`}
                      >
                        <ReactMarkdown
                          children={msg.content}
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ inline, children, ...props }) {
                              return inline ? (
                                <code className="bg-gray-200 px-1 rounded">{children}</code>
                              ) : (
                                <pre className="bg-gray-200 px-2 rounded" {...props}>
                                  <code>{children}</code>
                                </pre>
                              );
                            },
                            ul: ({ children }) => <ul className="list-disc ml-4">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-4">{children}</ol>,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="w-full items-center flex justify-center gap-3">
                      <Loader2 className="animate-spin h-5 w-5 text-primary" />
                      <button
                        className="underline"
                        type="button"
                        onClick={() => stop()}
                      >
                        Abort
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="w-full items-center flex justify-center gap-3">
                      <div>An Error Occurred</div>
                      <button
                        className="underline"
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
                <form onSubmit={handleSubmit} className="flex w-full  items-center space-x-2">
                  <Input value={input} onChange={handleInputChange} className='flex-1' placeholder="Type your message here..." />
                  <Button type="submit" className='size-9' disabled={isLoading} size='icon'><Send className="size-4" /></Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
