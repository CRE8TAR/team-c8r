
import { 
  MessageSquare, 
  Sparkles, 
  Layers, 
  Store, 
  Vote, 
  Users 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      title: "AI Companion",
      description: "Chat with your emotionally intelligent avatar that remembers your conversations.",
      icon: MessageSquare
    },
    {
      title: "Avatar Minting",
      description: "Create unique NFT avatars with customizable emotional traits.",
      icon: Sparkles
    },
    {
      title: "Fusion Lab",
      description: "Combine two avatars to create a hybrid with enhanced emotional intelligence.",
      icon: Layers
    },
    {
      title: "Plugin Marketplace",
      description: "Discover and integrate new emotional capabilities into your avatar.",
      icon: Store
    },
    {
      title: "DAO Governance",
      description: "Vote on proposals and shape the future of the ROHUM ecosystem.",
      icon: Vote
    },
    {
      title: "Emotional Memory",
      description: "Your avatar learns from interactions and develops a unique personality.",
      icon: Users
    }
  ];

  return (
    <section className="py-20 bg-secondary/40" id="features">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            A New Paradigm of <span className="gradient-text">Digital Companions</span>
          </h2>
          <p className="text-muted-foreground">
            ROHUM combines blockchain technology with emotional AI to create truly unique digital companions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
