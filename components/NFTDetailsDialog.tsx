
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Image, 
  Calendar,
  Palette,
  Globe,
  Mic,
  Zap,
  Crown,
  Hash
} from "lucide-react";

interface NFTDetailsDialogProps {
  nft: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NFTDetailsDialog({ nft, open, onOpenChange }: NFTDetailsDialogProps) {
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            {nft.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-rohum-blue/10 to-rohum-pink/10">
            {nft.image_url ? (
              <img 
                src={nft.image_url} 
                alt={nft.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <Card>
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
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{nft.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Technical Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Technical Specifications</h3>
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
                  <Zap className="w-4 h-4 text-muted-foreground" />
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
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Personality Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {nft.personality_traits.map((trait: string, index: number) => (
                    <Badge key={index} variant="secondary">
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
