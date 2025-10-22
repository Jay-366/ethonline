import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Zap, Shield, Users } from 'lucide-react';

export default function FeaturesSection() {
  return (
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
  );
}