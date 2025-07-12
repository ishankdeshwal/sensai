import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="link" className="gap-2 pl-0 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold gradient-title">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold gradient-title">Get in Touch</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our team is here to help you succeed in your career journey. Whether you have 
                questions about our features, need technical support, or want to share feedback, 
                we're ready to assist you.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground text-sm">contact@sensai.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Support</p>
                    <p className="text-muted-foreground text-sm">support@sensai.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold gradient-title">Quick Links</h2>
              <div className="space-y-3">
                <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
                <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="/dashboard" className="block text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center space-y-4">
            <h2 className="text-3xl font-bold gradient-title">Ready to Get Started?</h2>
            <p className="text-muted-foreground">
              Join thousands of professionals who are already using Sensai to advance their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="lg">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 