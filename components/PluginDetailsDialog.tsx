
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Star, Zap, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface PluginDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plugin: {
    name: string;
    description: string;
    price: number;
    icon: string;
  };
}

export function PluginDetailsDialog({ open, onOpenChange, plugin }: PluginDetailsDialogProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [c8rBalance, setC8rBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && open) {
      fetchUserBalance();
    }
  }, [user, open]);

  const fetchUserBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('c8r_balance')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setC8rBalance(data?.c8r_balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const updateUserBalance = async (newBalance: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ c8r_balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;
      setC8rBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate("/auth");
      onOpenChange(false);
      return;
    }

    if (c8rBalance < plugin.price) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${plugin.price} $C8R to purchase this plugin. Your current balance is ${c8rBalance} $C8R.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Deduct C8R balance
      await updateUserBalance(c8rBalance - plugin.price);

      toast({
        title: "Plugin Purchased!",
        description: `You have successfully purchased ${plugin.name}. ${plugin.price} $C8R has been deducted from your balance.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to purchase plugin:", error);
      toast({
        title: "Purchase Failed",
        description: "There was an error purchasing the plugin. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{plugin.name}</DialogTitle>
          <DialogDescription>{plugin.description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{plugin.price} $C8R</span>
              <span className="text-sm text-muted-foreground">≈ $199.99 USD</span>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    {c8rBalance} $C8R
                  </span>
                </div>
              )}
              <Button 
                onClick={handlePurchase}
                disabled={isLoading || (user && c8rBalance < plugin.price)}
                className="bg-gradient-to-r from-rohum-blue to-rohum-purple"
              >
                {isLoading ? "Purchasing..." : "Buy Now"}
              </Button>
            </div>
          </div>

          {user && c8rBalance < plugin.price && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                Insufficient balance. You need {plugin.price - c8rBalance} more $C8R to purchase this plugin.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Award className="text-primary" />
                  <h3 className="font-semibold">Quality Assured</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Rigorously tested for emotional intelligence accuracy
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Star className="text-primary" />
                  <h3 className="font-semibold">Personalized</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Adapts to your avatar's personality and learning style
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Zap className="text-primary" />
                  <h3 className="font-semibold">Enhanced AI</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Specialized neural networks for domain expertise
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Capabilities</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                Dynamic emotional response calibration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                Real-time sentiment analysis and adaptation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                Personalized learning path generation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                Context-aware conversation handling
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <div className="text-sm text-muted-foreground">
              <p>• Minimum 100 $C8R tokens in wallet</p>
              <p>• Avatar level 2 or higher</p>
              <p>• Active wallet connection</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
