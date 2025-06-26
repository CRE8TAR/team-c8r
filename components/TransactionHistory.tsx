
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  ShoppingCart, 
  TrendingUp, 
  Download, 
  Upload,
  Clock,
  Gift
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface Reward {
  id: string;
  amount: number;
  reward_type: string;
  description: string;
  created_at: string;
}

export function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchRewards();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchRewards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine transactions and rewards into a single list
  const allTransactions = [
    ...transactions.map(t => ({ ...t, source: 'transaction' })),
    ...rewards.map(r => ({ 
      id: r.id, 
      type: 'earning', 
      amount: r.amount, 
      description: r.description, 
      created_at: r.created_at,
      source: 'reward',
      reward_type: r.reward_type
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const getTransactionIcon = (type: string, rewardType?: string) => {
    switch (type) {
      case 'mint':
        return <Coins className="w-4 h-4 text-blue-500" />;
      case 'purchase':
        return <ShoppingCart className="w-4 h-4 text-purple-500" />;
      case 'earning':
        return <Gift className="w-4 h-4 text-green-500" />;
      case 'deposit':
        return <Download className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <Upload className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string, rewardType?: string) => {
    switch (type) {
      case 'mint':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'purchase':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'earning':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'deposit':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'withdrawal':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getDisplayType = (type: string, rewardType?: string) => {
    if (type === 'earning' && rewardType) {
      return rewardType.replace('_', ' ').charAt(0).toUpperCase() + rewardType.replace('_', ' ').slice(1);
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {allTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No transactions yet. Start minting avatars, completing tasks, or making purchases!
          </p>
        ) : (
          <div className="space-y-4">
            {allTransactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type, transaction.reward_type)}
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={getTransactionColor(transaction.type, transaction.reward_type)}
                  >
                    {getDisplayType(transaction.type, transaction.reward_type)}
                  </Badge>
                  <span
                    className={`font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} $C8R
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
