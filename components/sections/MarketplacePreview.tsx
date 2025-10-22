import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';

export default function MarketplacePreview() {
  return (
    <section className="px-6 py-20" style={{ backgroundColor: 'rgba(251, 237, 224, 0.05)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#FBede0' }}>
            Featured Agents
          </h2>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
            Discover the most popular and powerful AI agents in our marketplace
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-transparent border-2 hover:border-blue-400 transition-all duration-300" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#FBede0' }}>Code Assistant</CardTitle>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>4.9</span>
                </div>
              </div>
              <CardDescription style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                Advanced coding agent with multi-language support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" style={{ color: '#FBede0' }}>0.5 ETH</span>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border-2 hover:border-purple-400 transition-all duration-300" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#FBede0' }}>Data Analyst</CardTitle>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>4.8</span>
                </div>
              </div>
              <CardDescription style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                Intelligent data processing and visualization agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" style={{ color: '#FBede0' }}>0.3 ETH</span>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent border-2 hover:border-green-400 transition-all duration-300" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#FBede0' }}>Content Creator</CardTitle>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span style={{ color: 'rgba(251, 237, 224, 0.7)' }}>4.7</span>
                </div>
              </div>
              <CardDescription style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                Creative writing and content generation specialist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold" style={{ color: '#FBede0' }}>0.2 ETH</span>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 px-8 py-4 text-lg"
            style={{ 
              borderColor: 'rgba(251, 237, 224, 0.3)',
              color: '#FBede0'
            }}
            asChild
          >
            <Link href="/marketplace">
              View All Agents
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}