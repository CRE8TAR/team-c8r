
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { WalletConnect } from "@/components/WalletConnect";
import { Trash2, UserPlus, Copy, Check, Wallet, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface WalletAddress {
  address: string;
  label: string;
  primary: boolean;
}

export function WalletDetailsDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([
    { address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", label: "Main Wallet", primary: true },
    { address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", label: "Trading Wallet", primary: false },
  ]);
  
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [newWalletLabel, setNewWalletLabel] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [c8rBalance, setC8rBalance] = useState(0);
  
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
  
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleAddWallet = () => {
    if (newWalletAddress && newWalletLabel) {
      setWalletAddresses([
        ...walletAddresses,
        {
          address: newWalletAddress,
          label: newWalletLabel,
          primary: false
        }
      ]);
      setNewWalletAddress("");
      setNewWalletLabel("");
    }
  };
  
  const handleRemoveWallet = (addressToRemove: string) => {
    setWalletAddresses(walletAddresses.filter(w => w.address !== addressToRemove));
  };
  
  const handleSetPrimary = (address: string) => {
    setWalletAddresses(
      walletAddresses.map(wallet => ({
        ...wallet,
        primary: wallet.address === address
      }))
    );
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Details
          </DialogTitle>
          <DialogDescription>
            Manage your connected wallet addresses and view your balance.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {/* C8R Balance Display */}
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">$C8R Balance</span>
              </div>
              <span className="text-2xl font-bold text-yellow-800">{c8rBalance}</span>
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              Use C8R to mint avatars, buy plugins, and more
            </p>
          </div>

          {walletAddresses.length > 0 ? (
            <div className="space-y-3">
              {walletAddresses.map((wallet) => (
                <div 
                  key={wallet.address} 
                  className={`p-3 rounded-md border flex items-center justify-between ${
                    wallet.primary ? "border-rohum-blue bg-rohum-blue/5" : "border-border"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{wallet.label}</span>
                      {wallet.primary && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{formatAddress(wallet.address)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopyAddress(wallet.address)}
                      className="h-8 w-8"
                    >
                      {copied === wallet.address ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" side="bottom" align="end">
                        <div className="space-y-3">
                          <p className="text-sm">Remove this wallet address?</p>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemoveWallet(wallet.address)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {!wallet.primary && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => handleSetPrimary(wallet.address)}
                      >
                        Set as Primary
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No wallet addresses connected.</p>
            </div>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full flex items-center" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Wallet Address
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Wallet Address</SheetTitle>
                <SheetDescription>
                  Add a new wallet address to your profile.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Wallet Address
                  </label>
                  <Input 
                    id="address" 
                    placeholder="0x..." 
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="label" className="text-sm font-medium">
                    Wallet Label
                  </label>
                  <Input 
                    id="label" 
                    placeholder="Main Wallet" 
                    value={newWalletLabel}
                    onChange={(e) => setNewWalletLabel(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={handleAddWallet}
                  disabled={!newWalletAddress || !newWalletLabel}
                >
                  Add Wallet
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <DialogFooter className="mt-6">
          <WalletConnect />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
