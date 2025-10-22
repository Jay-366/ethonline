import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="px-6 py-20" style={{ backgroundColor: 'rgba(251, 237, 224, 0.05)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#FBede0' }}>
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-xl mb-8" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
          Join thousands of users already building the future with AI agents
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
            asChild
          >
            <Link href="/marketplace">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 px-8 py-4 text-lg"
            style={{ 
              borderColor: 'rgba(251, 237, 224, 0.3)',
              color: '#FBede0'
            }}
            asChild
          >
            <Link href="/settings">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}