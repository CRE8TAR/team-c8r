
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Wallet, Brain, CreditCard } from "lucide-react";

export function BuyTokens() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");

  const mockWallets = [
    { id: "1", address: "0x1234...5678", balance: "1.45 ETH" },
    { id: "2", address: "0x8765...4321", balance: "0.75 ETH" },
    { id: "3", address: "0x9876...1234", balance: "2.30 ETH" },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Buy $C8</h1>
          <p className="text-muted-foreground">
            Power your emotional AI avatar and unlock features in the CRE8TAR ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Buy Form */}
          <div className="space-y-8">
            <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple"
                  size="lg"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Wallet</DialogTitle>
                  <DialogDescription>
                    Choose a wallet to connect to the ROHUM ecosystem
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {mockWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedWallet === wallet.id
                          ? "border-rohum-blue bg-accent/10"
                          : "hover:border-rohum-blue/50"
                      }`}
                      onClick={() => setSelectedWallet(wallet.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{wallet.address}</p>
                          <p className="text-sm text-muted-foreground">{wallet.balance}</p>
                        </div>
                        <div className="h-4 w-4 rounded-full border border-rohum-blue"></div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple"
                    disabled={!selectedWallet}
                    onClick={() => {
                      setIsConnected(true);
                      setShowWalletModal(false);
                    }}
                  >
                    Connect Selected Wallet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="text-2xl font-bold">$0.85</p>
                  </div>
                  <div>
                    <p className="text-sm text-right text-muted-foreground">24h Change</p>
                    <p className="text-green-500">+5.2%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (USD)</label>
                <Input type="number" placeholder="Enter amount" />
                <p className="text-sm text-muted-foreground">≈ 1,176.47 $ROHUM</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Credit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="eth">
                      <div className="flex items-center">
                        <img src="/eth-logo.png" alt="ETH" className="mr-2 h-4 w-4" />
                        ETH
                      </div>
                    </SelectItem>
                    <SelectItem value="usdt">
                      <div className="flex items-center">
                        <img src="/usdt-logo.png" alt="USDT" className="mr-2 h-4 w-4" />
                        USDT
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple"
                size="lg"
                disabled={!isConnected}
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Right Side - Avatar Preview */}
          <div className="relative">
            <div className="aspect-square rounded-full bg-gradient-to-br from-rohum-blue to-rohum-pink p-1">
              <div className="rounded-full bg-background w-full h-full flex items-center justify-center">
                <Brain className="w-1/3 h-1/3 opacity-50 animate-pulse" />
              </div>
            </div>
            <div className="absolute inset-0 animate-float">
              <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-rohum-blue/20 to-rohum-pink/20 blur-xl"></div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-medium">This avatar grows with your $CRE8TAR!</p>
              <p className="text-sm text-muted-foreground">Power up your emotional intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
