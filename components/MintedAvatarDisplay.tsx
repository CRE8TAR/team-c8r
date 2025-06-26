
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Download, Share2, Globe, Coins, Shield, Zap } from "lucide-react";

interface MintedAvatarDisplayProps {
  avatarData: any;
  onCreateAnother: () => void;
}

export function MintedAvatarDisplay({ avatarData, onCreateAnother }: MintedAvatarDisplayProps) {
  const nftFeatures = [
    {
      title: "Unique Identity with Metadata",
      description: "All attributes stored securely on IPFS",
      icon: <Check className="h-5 w-5 text-green-500" />
    },
    {
      title: "Custom Appearance & Voice",
      description: `${avatarData.modelSource} model with ${avatarData.voiceSample} voice`,
      icon: <Check className="h-5 w-5 text-green-500" />
    },
    {
      title: "AI Content Capability",
      description: `Generates ${avatarData.roleType} content automatically`,
      icon: <Zap className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Revenue-Enabled via Subscriptions",
      description: "Earn through tiered subscription models",
      icon: <Coins className="h-5 w-5 text-yellow-500" />
    },
    {
      title: "ERC-1155 Fractional Ownership",
      description: "Supports fractional ownership and multiple editions",
      icon: <Shield className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Cross-Platform Compatible",
      description: "Deploy to Metaverse, Zoom, Teams, and more",
      icon: <Globe className="h-5 w-5 text-green-500" />
    },
    {
      title: `${avatarData.royaltyPercentage}% Creator Royalty`,
      description: "Earn from secondary sales and subscriptions",
      icon: <Coins className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Avatar NFT Minted Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="relative mx-auto w-64 h-64 rounded-lg overflow-hidden bg-gradient-to-br from-rohum-blue/20 to-rohum-pink/20">
            <img 
              src={avatarData.imageUrl || "/lovable-uploads/468a6d94-846d-42c1-bb48-cc58cecea2df.png"}
              alt="Minted Avatar NFT"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500 text-white">NFT</Badge>
            </div>
            <div className="absolute top-4 left-4">
              <Badge variant="secondary">ERC-1155</Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{avatarData.name}</h3>
            <p className="text-muted-foreground">{avatarData.description || "Your unique AI avatar"}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {avatarData.personalityTraits.map((trait: string) => (
                <Badge key={trait} variant="secondary">{trait}</Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left space-y-1">
              <p><strong>Model:</strong> {avatarData.modelSource}</p>
              <p><strong>Voice:</strong> {avatarData.voiceSample}</p>
              <p><strong>Role:</strong> {avatarData.roleType}</p>
            </div>
            <div className="text-left space-y-1">
              <p><strong>Language:</strong> {avatarData.language}</p>
              <p><strong>Gestures:</strong> {avatarData.gesturePackage}</p>
              <p><strong>Royalty:</strong> {avatarData.royaltyPercentage}%</p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎯 Your Avatar NFT Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nftFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                {feature.icon}
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onCreateAnother} variant="outline">
          Create Another Avatar
        </Button>
      </div>
    </div>
  );
}
