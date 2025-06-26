import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Extend window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletConnectProps {
  onWalletStatusChange?: (status: "connected" | "disconnected") => void;
}

export function WalletConnect({ onWalletStatusChange }: WalletConnectProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [c8rBalance, setC8rBalance] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserBalance();

      const storedWalletAddress = localStorage.getItem(`wallet_${user.id}`);
      if (storedWalletAddress) {
        setAddress(storedWalletAddress);
        setConnected(true);
        onWalletStatusChange && onWalletStatusChange("connected");
      }
    } else {
      setConnected(false);
      setAddress("");
      onWalletStatusChange && onWalletStatusChange("disconnected");
    }
  }, [user]);

  const fetchUserBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("c8r_balance")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setC8rBalance(data?.c8r_balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const connectWallet = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to connect.");
      }

      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];
      if (!walletAddress) throw new Error("No wallet address received.");

      setAddress(walletAddress);
      setConnected(true);
      localStorage.setItem(`wallet_${user.id}`, walletAddress);
      onWalletStatusChange && onWalletStatusChange("connected");

      toast({
        title: "Wallet Connected!",
        description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });

      console.log("Wallet connected:", walletAddress);
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress("");
    if (user) {
      localStorage.removeItem(`wallet_${user.id}`);
    }
    onWalletStatusChange && onWalletStatusChange("disconnected");

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const formatAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  if (!user) {
    return (
      <Button
        onClick={() => navigate("/auth")}
        className="bg-gradient-to-r from-rohum-blue to-rohum-purple hover:opacity-90"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Coins className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">{c8rBalance} $C8R</span>
        </div>
      )}

      {!connected ? (
        <Button
          onClick={connectWallet}
          disabled={isLoading}
          className="bg-gradient-to-r from-rohum-blue to-rohum-purple hover:opacity-90"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <Button
          onClick={disconnectWallet}
          variant="outline"
          className="border-rohum-blue text-rohum-blue hover:bg-rohum-blue/10"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {formatAddress(address)}
        </Button>
      )}
    </div>
  );
}
