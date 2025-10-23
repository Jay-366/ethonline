'use client';

import Link from 'next/link';
// Fast Bridge now lives in the Wallet page
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  Star,
  MessageSquare,
  ShoppingCart,
  Wallet,
  Settings
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#161823' }}>
      {/* Bridge UI is available under /wallet now */}
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6" style={{ color: '#FBede0' }}>
              AI Agent
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
              Discover, create, and trade intelligent AI agents. Build the future of autonomous collaboration.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
              asChild
            >
              <Link href="/marketplace">
                Explore Marketplace
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
              <Link href="/chat">
                Start Chatting
                <MessageSquare className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#FBede0' }}>
              Why Choose Our Platform?
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
              Experience the next generation of AI agent collaboration with cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-transparent border-2" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
              <CardHeader>
                <Bot className="h-12 w-12 mb-4" style={{ color: '#3B82F6' }} />
                <CardTitle style={{ color: '#FBede0' }}>Smart Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                  Advanced AI agents with specialized capabilities for every task
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-transparent border-2" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
              <CardHeader>
                <Zap className="h-12 w-12 mb-4" style={{ color: '#F59E0B' }} />
                <CardTitle style={{ color: '#FBede0' }}>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                  Optimized performance with real-time agent interactions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-transparent border-2" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
              <CardHeader>
                <Shield className="h-12 w-12 mb-4" style={{ color: '#10B981' }} />
                <CardTitle style={{ color: '#FBede0' }}>Secure Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                  Blockchain-powered marketplace with secure transactions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-transparent border-2" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
              <CardHeader>
                <Users className="h-12 w-12 mb-4" style={{ color: '#8B5CF6' }} />
                <CardTitle style={{ color: '#FBede0' }}>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                  Join a vibrant community of developers and AI enthusiasts
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
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

      {/* Quick Access Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#FBede0' }}>
              Get Started Today
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'rgba(251, 237, 224, 0.8)' }}>
              Choose your path and begin your AI agent journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/chat" className="group">
              <Card className="bg-transparent border-2 hover:border-blue-400 transition-all duration-300 group-hover:scale-105" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
                <CardHeader className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 group-hover:text-blue-400 transition-colors" style={{ color: '#3B82F6' }} />
                  <CardTitle style={{ color: '#FBede0' }}>Start Chatting</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Begin conversations with AI agents
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/marketplace" className="group">
              <Card className="bg-transparent border-2 hover:border-purple-400 transition-all duration-300 group-hover:scale-105" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
                <CardHeader className="text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 group-hover:text-purple-400 transition-colors" style={{ color: '#8B5CF6' }} />
                  <CardTitle style={{ color: '#FBede0' }}>Browse Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Explore the marketplace
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agents" className="group">
              <Card className="bg-transparent border-2 hover:border-green-400 transition-all duration-300 group-hover:scale-105" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
                <CardHeader className="text-center">
                  <Bot className="h-16 w-16 mx-auto mb-4 group-hover:text-green-400 transition-colors" style={{ color: '#10B981' }} />
                  <CardTitle style={{ color: '#FBede0' }}>Create Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Build your own AI agent
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/wallet" className="group">
              <Card className="bg-transparent border-2 hover:border-yellow-400 transition-all duration-300 group-hover:scale-105" style={{ borderColor: 'rgba(251, 237, 224, 0.2)' }}>
                <CardHeader className="text-center">
                  <Wallet className="h-16 w-16 mx-auto mb-4 group-hover:text-yellow-400 transition-colors" style={{ color: '#F59E0B' }} />
                  <CardTitle style={{ color: '#FBede0' }}>Manage Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center" style={{ color: 'rgba(251, 237, 224, 0.7)' }}>
                    Handle your transactions
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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
    </div>
  );
}