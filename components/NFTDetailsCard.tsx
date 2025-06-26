
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Image, 
  Calendar,
  Palette,
  Globe,
  Mic,
  Zap,
  Crown,
  Hash,
  Star,
  Heart
} from "lucide-react";

interface NFT {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  avatar_id?: string;
  created_at: string;
  nft_type: string;
  royalty_percentage: number;
  model_source: string;
  voice_sample: string;
  language: string;
  role_type: string;
  gesture_package: string;
  personality_traits: string[];
  price?: number;
}

interface NFTDetailsCardProps {
  nft: NFT | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NFTDetailsCard({ nft, open, onOpenChange }: NFTDetailsCardProps) {
  if (!nft) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage 
                src={nft.image_url || `https://images.unsplash.com/${nft.id || 'photo-1488590528505-98d2b5aba04b'}`} 
                alt={nft.name}
                className="object-cover"
              />
              <AvatarFallback>
                <Image className="w-6 h-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="gradient-text">{nft.name}</span>
              </div>
              {nft.price && (
                <p className="text-sm text-muted-foreground">{nft.price} $C8R</p>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avatar ID</p>
                    <p className="font-medium">{nft.avatar_id || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(nft.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">NFT Type</p>
                    <Badge variant="outline">{nft.nft_type}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Royalty</p>
                    <p className="font-medium">{nft.royalty_percentage}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {nft.description && (
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Description
                </h3>
                <p className="text-muted-foreground">{nft.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Technical Details */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">3D Model Source</p>
                    <p className="font-medium capitalize">{nft.model_source}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Voice Sample</p>
                    <p className="font-medium capitalize">{nft.voice_sample}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="font-medium capitalize">{nft.language}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role Type</p>
                    <p className="font-medium capitalize">{nft.role_type}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Gesture Package</p>
                <Badge variant="outline" className="capitalize">
                  {nft.gesture_package.replace('-', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Personality Traits */}
          {nft.personality_traits && nft.personality_traits.length > 0 && (
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Personality Traits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nft.personality_traits.map((trait: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-gradient-to-r from-rohum-blue/20 to-rohum-pink/20">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
