import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
            <h1 className="text-6xl font-bold gradient-title">About Sensai</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering professionals with AI-driven career tools to accelerate their success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold gradient-title">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Sensai, we believe that every professional deserves access to cutting-edge tools 
                that can help them succeed in their career. Our AI-powered platform provides 
                personalized insights, intelligent resume building, and comprehensive interview 
                preparation to help you stand out in today's competitive job market.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold gradient-title">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                We envision a world where career advancement is accessible to everyone, regardless 
                of their background or experience level. By leveraging artificial intelligence and 
                industry insights, we're building the future of professional development.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-3xl font-bold gradient-title text-center">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3 p-6 rounded-lg bg-muted/20">
                <h3 className="text-xl font-semibold">AI Resume Builder</h3>
                <p className="text-muted-foreground text-sm">
                  Create professional resumes tailored to your industry with AI-powered suggestions.
                </p>
              </div>
              <div className="text-center space-y-3 p-6 rounded-lg bg-muted/20">
                <h3 className="text-xl font-semibold">Cover Letter Generator</h3>
                <p className="text-muted-foreground text-sm">
                  Generate compelling cover letters that match your resume and job requirements.
                </p>
              </div>
              <div className="text-center space-y-3 p-6 rounded-lg bg-muted/20">
                <h3 className="text-xl font-semibold">Interview Preparation</h3>
                <p className="text-muted-foreground text-sm">
                  Practice with industry-specific questions and get personalized feedback.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center space-y-4">
            <h2 className="text-3xl font-bold gradient-title">Get Started Today</h2>
            <p className="text-muted-foreground">
              Join thousands of professionals who are already using Sensai to advance their careers.
            </p>
            <Link href="/onboarding">
              <Button size="lg" className="mt-4">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 