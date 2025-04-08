"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  MessageSquare, 
  Globe, 
  Shield, 
  Users, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Paperclip, 
  Smile, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Contact information data
const contactInfo = [
  {
    name: "Email",
    description: "support@imagero.com",
    icon: Mail,
    details: "We typically respond within 24 hours",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
  },
  {
    name: "Office",
    description: "123 Tech Street, San Francisco, CA 94105",
    icon: MapPin,
    details: "Visit us Monday to Friday, 9am - 5pm PST",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
  },
  {
    name: "Phone",
    description: "+1 (555) 123-4567",
    icon: Phone,
    details: "Available Monday to Friday, 9am - 5pm PST",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
  {
    name: "Live Chat",
    description: "Available 24/7",
    icon: MessageSquare,
    details: "Get instant support from our team",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
  },
];

// FAQ data
const faqs = [
  {
    question: "What are your business hours?",
    answer: "Our support team is available Monday through Friday, 9am to 5pm PST. For urgent issues, you can reach us through our 24/7 live chat service.",
  },
  {
    question: "How long does it take to get a response?",
    answer: "We typically respond to all inquiries within 24 hours. For urgent matters, please use our live chat service for immediate assistance.",
  },
  {
    question: "Do you offer enterprise support?",
    answer: "Yes, we provide dedicated enterprise support with guaranteed response times and dedicated account managers. Contact our sales team for more information.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes, we offer a 30-day money-back guarantee for all our plans. If you're not satisfied with our service, contact our support team for a full refund.",
  },
];

// Mock chat messages for the live chat feature
const initialChatMessages = [
  {
    id: 1,
    sender: "support",
    message: "Hello! How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

// AI response templates
const aiResponses = [
  "I can help you with that. Our image upscaler tool can enhance your images up to 4x their original size while maintaining quality.",
  "For the background removal tool, you can adjust the edge detection sensitivity in the settings panel.",
  "You can download your processed images by clicking the download button that appears after processing.",
  "Our image converter supports JPG, PNG, WebP, and GIF formats. You can convert between any of these formats.",
  "If you're experiencing issues with the process button, try refreshing the page or clearing your browser cache.",
  "For the best results with our tools, we recommend using images with a resolution of at least 1000x1000 pixels.",
  "You can access your processing history by clicking on the history icon in the top right corner of the tools page.",
  "Our premium features are available with a subscription. You can upgrade your account in the billing section.",
  "The image enhancement tool uses AI to automatically improve brightness, contrast, and color balance.",
  "For technical support, you can also email us at support@imagero.com and we'll get back to you within 24 hours."
];

// Knowledge base for AI responses
const knowledgeBase = {
  // Image processing tools
  "upscaler": {
    keywords: ["upscale", "upscaler", "enlarge", "increase size", "resolution", "quality", "pixel", "detail", "sharp", "blur"],
    response: "Our image upscaler tool can enhance your images up to 4x their original size while maintaining quality. Simply upload your image, select the desired scale factor (1.5x, 2x, 3x, or 4x), and click 'Process'. The tool uses advanced AI algorithms to preserve details and prevent pixelation. For best results, use images with a resolution of at least 1000x1000 pixels. The maximum file size is 25MB per image."
  },
  "background": {
    keywords: ["background", "remove", "transparent", "isolate", "extract", "subject", "foreground", "mask", "cutout", "separation"],
    response: "The background removal tool uses AI to detect and remove backgrounds from your images. You can adjust the edge detection sensitivity in the settings panel for better results. For best performance, use images with clear contrast between the subject and background. The tool works best with well-lit subjects and simple backgrounds. You can also use the auto-crop feature to automatically trim the image to the subject's boundaries."
  },
  "converter": {
    keywords: ["convert", "format", "jpg", "png", "webp", "gif", "file type", "extension", "change", "transform", "save as"],
    response: "Our image converter supports JPG, PNG, WebP, and GIF formats. You can convert between any of these formats by uploading your image, selecting the target format, and clicking 'Convert'. The tool preserves image quality during conversion. JPG is best for photographs, PNG for images requiring transparency, WebP for web optimization, and GIF for simple animations. You can also adjust quality settings for JPG and WebP formats."
  },
  "enhancement": {
    keywords: ["enhance", "improve", "brightness", "contrast", "color", "balance", "fix", "adjust", "optimize", "retouch", "edit"],
    response: "The image enhancement tool uses AI to automatically improve brightness, contrast, and color balance. It analyzes your image and applies the optimal adjustments to make it look its best. You can also manually adjust these settings if needed. The tool can fix common issues like underexposure, overexposure, and color casts. For portraits, it can also enhance skin tones and reduce noise."
  },
  
  // Account and subscription
  "subscription": {
    keywords: ["premium", "subscription", "plan", "upgrade", "pricing", "cost", "price", "payment", "billing", "monthly", "annual", "yearly"],
    response: "Our premium features are available with a subscription. We offer monthly and annual plans with different tiers. You can upgrade your account in the billing section. Premium users get access to higher resolution outputs, batch processing, and priority support. The monthly plan costs $9.99/month, and the annual plan costs $89.99/year (saving you 25%). We also offer a 30-day money-back guarantee if you're not satisfied with our service."
  },
  "account": {
    keywords: ["account", "profile", "settings", "preferences", "user", "login", "sign in", "register", "sign up", "password", "email"],
    response: "You can manage your account settings by clicking on your profile icon in the top right corner. From there, you can update your personal information, change your password, and manage your subscription. If you've forgotten your password, you can reset it by clicking the 'Forgot Password' link on the login page. We'll send a reset link to your registered email address."
  },
  
  // Technical support
  "download": {
    keywords: ["download", "save", "export", "get", "processed", "result", "file", "local", "computer", "device", "storage"],
    response: "You can download your processed images by clicking the download button that appears after processing. The button is located in the top right corner of the result panel. You can also save directly to your cloud storage if you've connected your account. For batch processing, you can download all processed images as a ZIP file. The downloaded images will maintain the quality and format you selected during processing."
  },
  "history": {
    keywords: ["history", "previous", "past", "processed", "recent", "recently", "last", "before", "again", "redo", "reprocess"],
    response: "You can access your processing history by clicking on the history icon in the top right corner of the tools page. This shows all your recent processed images, which you can download again or reprocess with different settings. Your history is stored for 30 days. Premium users can access their history for up to 1 year. You can also delete individual items from your history if needed."
  },
  "issue": {
    keywords: ["issue", "problem", "error", "bug", "not working", "fix", "troubleshoot", "broken", "fail", "crash", "hang", "freeze"],
    response: "If you're experiencing issues with our tools, try refreshing the page or clearing your browser cache. For persistent problems, please provide details about the error message and steps to reproduce it. You can also email us at support@imagero.com for technical assistance. Our support team is available Monday through Friday, 9am to 5pm PST. For urgent issues, please use our live chat service."
  },
  
  // General information
  "formats": {
    keywords: ["format", "supported", "compatible", "file type", "extension", "jpg", "png", "webp", "gif", "tiff", "bmp"],
    response: "Our tools support JPG, PNG, WebP, and GIF formats. For best results, we recommend using images with a resolution of at least 1000x1000 pixels. The maximum file size is 25MB per image. JPG is best for photographs, PNG for images requiring transparency, WebP for web optimization, and GIF for simple animations. We don't currently support RAW formats like CR2, NEF, or ARW."
  },
  "support": {
    keywords: ["support", "help", "contact", "assist", "question", "inquiry", "problem", "issue", "trouble", "difficulty", "guidance"],
    response: "For technical support, you can email us at support@imagero.com and we'll get back to you within 24 hours. For urgent issues, please use our live chat service. Our support team is available Monday through Friday, 9am to 5pm PST. Premium users get priority support with a guaranteed response time of 4 hours. You can also check our FAQ section for answers to common questions."
  },
  "business": {
    keywords: ["business", "hours", "available", "time", "schedule", "open", "closed", "weekend", "holiday", "support", "service"],
    response: "Our support team is available Monday through Friday, 9am to 5pm PST. For urgent issues, you can reach us through our 24/7 live chat service. We typically respond to all inquiries within 24 hours. Premium users get priority support with a guaranteed response time of 4 hours. Our office is closed on weekends and major holidays, but our automated systems and AI assistant are available 24/7."
  },
  "refund": {
    keywords: ["refund", "money back", "cancel", "subscription", "payment", "return", "reimbursement", "guarantee", "satisfaction", "dissatisfied"],
    response: "Yes, we offer a 30-day money-back guarantee for all our plans. If you're not satisfied with our service, contact our support team for a full refund. You can cancel your subscription at any time from your account settings. Refunds are processed within 5-7 business days and will be returned to the original payment method. If you've used premium features during your subscription period, you may be charged a prorated amount for the time used."
  },
  "pricing": {
    keywords: ["pricing", "cost", "price", "fee", "charge", "expensive", "cheap", "affordable", "value", "worth", "free", "trial"],
    response: "We offer a free tier with basic features and limited processing. Our premium plans start at $9.99/month or $89.99/year (saving you 25%). Premium users get access to higher resolution outputs, batch processing, priority support, and extended history. We also offer enterprise plans for businesses with custom pricing based on your needs. You can try our premium features with a 7-day free trial."
  },
  "security": {
    keywords: ["security", "privacy", "data", "safe", "secure", "protected", "confidential", "private", "encryption", "hack", "breach"],
    response: "We take your privacy and security seriously. All images uploaded to our platform are encrypted in transit and at rest. We don't store your images longer than necessary and automatically delete them after 30 days. We never share your data with third parties without your consent. Our platform is compliant with GDPR and CCPA regulations. You can request deletion of your data at any time."
  },
  "api": {
    keywords: ["api", "integration", "connect", "automate", "program", "code", "developer", "technical", "endpoint", "webhook", "sdk"],
    response: "We offer a RESTful API for developers who want to integrate our image processing tools into their applications. The API supports all our tools including upscaling, background removal, conversion, and enhancement. Documentation is available at api.imagero.com. We offer different API tiers with rate limits based on your needs. Enterprise customers can get custom API solutions with dedicated support."
  }
};

// Enhanced function to find the best response based on user query
const findBestResponse = (query: string) => {
  // Convert query to lowercase for case-insensitive matching
  const lowercaseQuery = query.toLowerCase();
  
  // Check for exact matches in knowledge base
  for (const [topic, data] of Object.entries(knowledgeBase)) {
    if (data.keywords.some(keyword => lowercaseQuery.includes(keyword))) {
      return data.response;
    }
  }
  
  // Check for FAQ matches
  const faqMatch = faqs.find(faq => 
    faq.question.toLowerCase().includes(lowercaseQuery) || 
    lowercaseQuery.includes(faq.question.toLowerCase())
  );
  if (faqMatch) {
    return faqMatch.answer;
  }
  
  // Check for contextual patterns
  if (lowercaseQuery.includes("hello") || lowercaseQuery.includes("hi") || lowercaseQuery.includes("hey")) {
    return "Hello! How can I assist you today with our image processing tools?";
  }
  
  if (lowercaseQuery.includes("thank") || lowercaseQuery.includes("thanks")) {
    return "You're welcome! Is there anything else I can help you with?";
  }
  
  if (lowercaseQuery.includes("bye") || lowercaseQuery.includes("goodbye")) {
    return "Goodbye! Feel free to reach out if you need any more assistance.";
  }
  
  // Check for specific question patterns
  if (lowercaseQuery.includes("how") && lowercaseQuery.includes("use")) {
    if (lowercaseQuery.includes("upscaler")) {
      return knowledgeBase.upscaler.response;
    } else if (lowercaseQuery.includes("background")) {
      return knowledgeBase.background.response;
    } else if (lowercaseQuery.includes("converter")) {
      return knowledgeBase.converter.response;
    } else if (lowercaseQuery.includes("enhance")) {
      return knowledgeBase.enhancement.response;
    }
  }
  
  if (lowercaseQuery.includes("what") && lowercaseQuery.includes("format")) {
    return knowledgeBase.formats.response;
  }
  
  if (lowercaseQuery.includes("how") && lowercaseQuery.includes("download")) {
    return knowledgeBase.download.response;
  }
  
  if (lowercaseQuery.includes("how") && lowercaseQuery.includes("history")) {
    return knowledgeBase.history.response;
  }
  
  if (lowercaseQuery.includes("how") && lowercaseQuery.includes("contact")) {
    return knowledgeBase.support.response;
  }
  
  if (lowercaseQuery.includes("what") && lowercaseQuery.includes("hour")) {
    return knowledgeBase.business.response;
  }
  
  if (lowercaseQuery.includes("how") && lowercaseQuery.includes("refund")) {
    return knowledgeBase.refund.response;
  }
  
  if (lowercaseQuery.includes("how") && lowercaseQuery.includes("much")) {
    return knowledgeBase.pricing.response;
  }
  
  if (lowercaseQuery.includes("how") && lowercaseQuery.includes("secure")) {
    return knowledgeBase.security.response;
  }
  
  if (lowercaseQuery.includes("api") || lowercaseQuery.includes("integrate")) {
    return knowledgeBase.api.response;
  }
  
  // If no specific match is found, provide a contextual response
  if (lowercaseQuery.includes("error") || lowercaseQuery.includes("problem") || lowercaseQuery.includes("issue")) {
    return knowledgeBase.issue.response;
  }
  
  // Default response for unrecognized queries
  return "I'm not sure I understand your question. Could you please rephrase it or try one of our quick reply suggestions?";
};

export default function ContactPage() {
  // State for the contact form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
  // State for the FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // State for the live chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<"ai" | "agent">("ai");
  const [showModeSelector, setShowModeSelector] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Replace the session-based avatar with a static approach
  const userAvatar = "/images/default-avatar.png";
  
  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
      
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form status after 3 seconds
      setTimeout(() => {
        setFormStatus("idle");
      }, 3000);
    }, 1500);
  };
  
  // Toggle FAQ accordion
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  // Toggle chat window
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setIsChatMinimized(false);
      setShowModeSelector(true);
    }
  };
  
  // Toggle chat minimized state
  const toggleChatMinimized = () => {
    setIsChatMinimized(!isChatMinimized);
  };
  
  // Select chat mode (AI or Agent)
  const selectChatMode = (mode: "ai" | "agent") => {
    setChatMode(mode);
    setShowModeSelector(false);
    
    // Add a welcome message based on the selected mode
    const welcomeMessage = {
      id: chatMessages.length + 1,
      sender: "support",
      message: mode === "ai" 
        ? "Hello! I'm your AI assistant. How can I help you today?" 
        : "Hello! A support agent will be with you shortly. In the meantime, is there anything specific you'd like to know about our services?",
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages((prev) => [...prev, welcomeMessage]);
  };
  
  // Send a new chat message
  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      sender: "user",
      message: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate support response after a delay
    setTimeout(() => {
      setIsTyping(false);
      
      let responseMessage;
      
      if (chatMode === "ai") {
        // AI response - use the enhanced findBestResponse function
        const aiResponse = findBestResponse(userMessage.message);
        responseMessage = {
          id: chatMessages.length + 2,
          sender: "support",
          message: aiResponse,
          timestamp: new Date().toISOString(),
        };
      } else {
        // Agent response
        responseMessage = {
          id: chatMessages.length + 2,
          sender: "support",
          message: "Thank you for your message. A support agent will be with you shortly. In the meantime, is there anything specific you'd like to know about our services?",
          timestamp: new Date().toISOString(),
        };
      }
      
      setChatMessages((prev) => [...prev, responseMessage]);
    }, 2000);
  };
  
  // Format timestamp for chat messages
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section with Animated Background */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/10">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>
          <div className="container py-24 sm:py-32">
            <motion.div 
              className="mx-auto max-w-4xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Get in Touch
              </h1>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contact Info Cards Section */}
        <div className="container py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    className={`rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ${item.bgColor}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${item.color} text-white mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-700 mb-2">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.details}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Contact Form and FAQ Section */}
        <div className="container py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
                Send us a message
              </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First name
                  </label>
                    <input
                      type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="John"
                      />
                </div>
                <div>
                  <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name
                  </label>
                    <input
                      type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Doe"
                    />
                  </div>
                </div>
                  <div>
                  <label
                    htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div>
                  <label
                    htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                    <select
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="enterprise">Enterprise Sales</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                  <label
                    htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div>
                    <Button 
                      type="submit" 
                      className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                        formStatus === "submitting" 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : formStatus === "success" 
                            ? "bg-green-500" 
                            : formStatus === "error" 
                              ? "bg-red-500" 
                              : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      }`}
                      disabled={formStatus === "submitting"}
                    >
                      {formStatus === "submitting" ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : formStatus === "success" ? (
                        <span className="flex items-center justify-center">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Message Sent!
                        </span>
                      ) : formStatus === "error" ? (
                        <span className="flex items-center justify-center">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Error. Try Again
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </span>
                      )}
                  </Button>
              </div>
            </form>
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleFaq(index)}
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {openFaqIndex === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ${
                          openFaqIndex === index ? "max-h-96" : "max-h-0"
                        }`}
                      >
                        <div className="p-4 bg-white">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Support Features Section */}
        <div className="container py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div 
              className="mx-auto max-w-2xl text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Support Features
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We provide comprehensive support to ensure you get the most out of our platform.
              </p>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="inline-flex p-3 rounded-lg bg-blue-50 text-blue-600 mb-4">
                  <Users className="h-6 w-6" />
            </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dedicated Support Team</h3>
                <p className="text-gray-600">
                  Our team of experts is ready to help you with any questions or issues you may have.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="inline-flex p-3 rounded-lg bg-green-50 text-green-600 mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Availability</h3>
                <p className="text-gray-600">
                  We provide support in multiple languages and time zones to ensure you always have access to help.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="inline-flex p-3 rounded-lg bg-purple-50 text-purple-600 mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Communication</h3>
                <p className="text-gray-600">
                  All our communication channels are encrypted to ensure your data remains secure and private.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Live Chat Widget */}
      {isChatOpen && (
        <div 
          className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
            isChatMinimized ? "w-64 h-12" : "w-96 h-[500px]"
          }`}
        >
          <div className="bg-white rounded-lg shadow-xl h-full flex flex-col overflow-hidden border border-gray-200">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-3 flex items-center justify-between text-white">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span className="font-medium">Live Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleChatMinimized}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  {isChatMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </button>
                <button 
                  onClick={toggleChat}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Chat Body - Only show when not minimized */}
            {!isChatMinimized && (
              <>
                {/* Chat Mode Selector */}
                {showModeSelector ? (
                  <div className="p-4 bg-gray-50 flex flex-col items-center justify-center h-full">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">How would you like to get help?</h3>
                    <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
                      <button
                        onClick={() => selectChatMode("ai")}
                        className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-primary"
                      >
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900">AI Assistant</h4>
                          <p className="text-sm text-gray-500">Get instant answers to common questions</p>
                        </div>
                      </button>
                      <button
                        onClick={() => selectChatMode("agent")}
                        className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-primary"
                      >
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900">Human Agent</h4>
                          <p className="text-sm text-gray-500">Connect with a support specialist</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat Status Bar */}
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${chatMode === "ai" ? "bg-blue-500" : "bg-green-500"}`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          {chatMode === "ai" ? "AI Assistant" : "Support Agent"}
                        </span>
                      </div>
                      <button 
                        onClick={() => setShowModeSelector(true)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Switch mode
                      </button>
                    </div>
                    
                    {/* Chat Messages */}
                    <div 
                      ref={chatContainerRef}
                      className="flex-1 p-3 overflow-y-auto bg-gray-50"
                    >
                      {chatMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.sender === "support" && (
                            <div className="flex-shrink-0 mr-2 mt-1">
                              {chatMode === "ai" ? (
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                  <Users className="h-3.5 w-3.5 text-green-600" />
                                </div>
                              )}
                            </div>
                          )}
                          <div 
                            className={`max-w-[85%] rounded-lg p-1.5 ${
                              message.sender === "user" 
                                ? "bg-primary text-white rounded-br-none" 
                                : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                            }`}
                          >
                            <p className="text-xs leading-relaxed">{message.message}</p>
                            <p className={`text-[10px] mt-0 ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                              {formatTimestamp(message.timestamp)}
                            </p>
                          </div>
                          {message.sender === "user" && (
                            <div className="flex-shrink-0 ml-2 mt-1">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {userAvatar ? (
                                  <img 
                                    src={userAvatar} 
                                    alt="User avatar" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start mb-3">
                          <div className="flex-shrink-0 mr-2 mt-1">
                            {chatMode === "ai" ? (
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <Users className="h-3.5 w-3.5 text-green-600" />
                              </div>
                            )}
                          </div>
                          <div className="bg-white text-gray-800 rounded-lg rounded-bl-none p-2 shadow-sm">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Reply Suggestions for AI Mode */}
                    {chatMode === "ai" && chatMessages.length > 1 && !isTyping && (
                      <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => setNewMessage("How do I use the image upscaler?")}
                              className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors flex-1"
                            >
                              How do I use the image upscaler?
                            </button>
                            <button 
                              onClick={() => setNewMessage("What image formats are supported?")}
                              className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors flex-1"
                            >
                              What image formats are supported?
                            </button>
                          </div>
                          <div className="flex justify-center">
                            <button 
                              onClick={() => setNewMessage("How do I download my processed images?")}
                              className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                            >
                              How do I download my processed images?
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Chat Input */}
                    <form onSubmit={sendChatMessage} className="p-2 border-t border-gray-200 bg-white">
                      <div className="flex items-center space-x-1.5">
                        <button 
                          type="button" 
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                        />
                        <button 
                          type="button" 
                          className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Smile className="h-4 w-4" />
                        </button>
                        <button 
                          type="submit" 
                          className="p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Chat Toggle Button - Only show when chat is closed */}
      {!isChatOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={toggleChat}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
        >
          <MessageSquare className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
} 