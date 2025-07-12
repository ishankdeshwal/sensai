"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  FileText, 
  PenBox, 
  GraduationCap, 
  LayoutDashboard,
  Heart,
  ExternalLink
} from 'lucide-react';
import { subscribeToNewsletter } from '@/actions/newsletter';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const productLinks = [
    { name: 'Resume Builder', href: '/resume', icon: FileText },
    { name: 'Cover Letter Generator', href: '/ai-cover-letter', icon: PenBox },
    { name: 'Interview Prep', href: '/interview', icon: GraduationCap },
    { name: 'Industry Insights', href: '/dashboard', icon: LayoutDashboard },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'Email', href: 'mailto:contact@sensai.com', icon: Mail },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubscribing(true);
    try {
      await subscribeToNewsletter(email);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Failed to subscribe');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image 
                src="/logo.png" 
                alt="Sensai Logo" 
                width={180} 
                height={54} 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering professionals with AI-driven career tools. Build better resumes, 
              craft compelling cover letters, and ace your interviews with personalized insights.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg gradient-title">Products</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg gradient-title">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg gradient-title">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Get the latest career insights and product updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={isSubscribing}
              />
              <button 
                type="submit"
                disabled={isSubscribing}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} Sensai. All rights reserved.</span>
              <span>•</span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for professionals</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Powered by AI</span>
              <span>•</span>
              <Link 
                href="https://nextjs.org" 
                className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Built with Next.js
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 