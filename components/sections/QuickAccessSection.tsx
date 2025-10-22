import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, ShoppingCart, Bot, Wallet } from 'lucide-react';

export default function QuickAccessSection() {
  return (
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
  );
}