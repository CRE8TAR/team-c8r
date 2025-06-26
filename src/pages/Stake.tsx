
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, TrendingUp, Lock, Unlock, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface StakingPosition {
  id: string;
  amount: number;
  start_date: string;
  unlock_date: string;
  rewards_earned: number;
  is_active: boolean;
}

const Stake = () => {
  const { user } = useAuth();
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakingPeriod, setStakingPeriod] = useState("30");
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStaked, setTotalStaked] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserBalance();
      fetchStakingPositions();
    }
  }, [user]);

  const fetchUserBalance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('c8r_balance')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setUserBalance(data?.c8r_balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchStakingPositions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('staking')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStakingPositions(data || []);
      
      const total = data?.reduce((sum, position) => sum + (position.is_active ? position.amount : 0), 0) || 0;
      setTotalStaked(total);
    } catch (error) {
      console.error('Error fetching staking positions:', error);
    }
  };

  const calculateAPY = (period: string) => {
    const periodDays = parseInt(period);
    if (periodDays === 30) return 8;
    if (periodDays === 90) return 12;
    if (periodDays === 180) return 18;
    if (periodDays === 365) return 25;
    return 8;
  };

  const handleStake = async () => {
    if (!user || !stakeAmount) return;

    const amount = parseInt(stakeAmount);
    if (amount <= 0 || amount > userBalance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount within your balance.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const periodDays = parseInt(stakingPeriod);
      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + periodDays);

      // Create staking position
      const { error: stakingError } = await supabase
        .from('staking')
        .insert({
          user_id: user.id,
          amount,
          unlock_date: unlockDate.toISOString()
        });

      if (stakingError) throw stakingError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ c8r_balance: userBalance - amount })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'staking',
          amount: -amount,
          description: `Staked ${amount} $C8R for ${stakingPeriod} days`
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Staking Successful!",
        description: `You have staked ${amount} $C8R for ${stakingPeriod} days.`
      });

      setStakeAmount("");
      fetchUserBalance();
      fetchStakingPositions();
    } catch (error) {
      console.error('Error staking:', error);
      toast({
        title: "Staking Failed",
        description: "There was an error processing your stake.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnstake = async (position: StakingPosition) => {
    if (!user) return;

    const now = new Date();
    const unlockDate = new Date(position.unlock_date);
    
    if (now < unlockDate) {
      toast({
        title: "Position Locked",
        description: "This staking position is still locked.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Calculate rewards (simplified calculation)
      const stakingDays = Math.floor((now.getTime() - new Date(position.start_date).getTime()) / (1000 * 60 * 60 * 24));
      const apy = calculateAPY("30"); // Use base APY for calculation
      const rewards = Math.floor((position.amount * apy / 100 * stakingDays) / 365);
      const totalReturn = position.amount + rewards;

      // Update staking position
      const { error: stakingError } = await supabase
        .from('staking')
        .update({ 
          is_active: false, 
          rewards_earned: rewards 
        })
        .eq('id', position.id);

      if (stakingError) throw stakingError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ c8r_balance: userBalance + totalReturn })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'earning',
          amount: totalReturn,
          description: `Unstaked ${position.amount} $C8R + ${rewards} rewards`
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Unstaking Successful!",
        description: `You received ${totalReturn} $C8R (${rewards} rewards).`
      });

      fetchUserBalance();
      fetchStakingPositions();
    } catch (error) {
      console.error('Error unstaking:', error);
      toast({
        title: "Unstaking Failed",
        description: "There was an error processing your unstake.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="mb-4">Please sign in to access staking features.</p>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-8 bg-primary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">
                Stake <span className="gradient-text">$C8R Tokens</span>
              </h1>
              <p className="text-muted-foreground">
                Earn rewards by staking your $C8R tokens and participate in governance.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Staking Overview */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-2xl font-bold text-rohum-blue">{userBalance} $C8R</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Staked</p>
                      <p className="text-2xl font-bold text-rohum-purple">{totalStaked} $C8R</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Stake New Position */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plus className="mr-2 h-5 w-5" />
                      Stake Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Amount to Stake</label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        max={userBalance}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Staking Period</label>
                      <select
                        className="w-full mt-1 p-2 border rounded-md"
                        value={stakingPeriod}
                        onChange={(e) => setStakingPeriod(e.target.value)}
                      >
                        <option value="30">30 Days (8% APY)</option>
                        <option value="90">90 Days (12% APY)</option>
                        <option value="180">180 Days (18% APY)</option>
                        <option value="365">365 Days (25% APY)</option>
                      </select>
                    </div>

                    <Button
                      onClick={handleStake}
                      disabled={!stakeAmount || isLoading}
                      className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple"
                    >
                      {isLoading ? "Staking..." : "Stake Tokens"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Staking Positions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Staking Positions</CardTitle>
                    <CardDescription>
                      Manage your active and completed staking positions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stakingPositions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No staking positions yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Start staking to earn rewards!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {stakingPositions.map((position) => {
                          const unlockDate = new Date(position.unlock_date);
                          const isLocked = new Date() < unlockDate;
                          const progress = isLocked ? 
                            ((new Date().getTime() - new Date(position.start_date).getTime()) / 
                             (unlockDate.getTime() - new Date(position.start_date).getTime())) * 100 : 100;

                          return (
                            <div key={position.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold">{position.amount} $C8R</span>
                                    <Badge variant={position.is_active ? "default" : "secondary"}>
                                      {position.is_active ? "Active" : "Completed"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Staked: {new Date(position.start_date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    {isLocked ? <Lock className="mr-1 h-4 w-4" /> : <Unlock className="mr-1 h-4 w-4" />}
                                    {unlockDate.toLocaleDateString()}
                                  </div>
                                  {position.rewards_earned > 0 && (
                                    <p className="text-sm text-green-600">
                                      +{position.rewards_earned} rewards
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {position.is_active && (
                                <>
                                  <Progress value={Math.min(progress, 100)} className="mb-3" />
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      {isLocked ? `${Math.ceil((unlockDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining` : "Ready to unstake"}
                                    </span>
                                    <Button
                                      size="sm"
                                      onClick={() => handleUnstake(position)}
                                      disabled={isLocked || isLoading}
                                      variant={isLocked ? "outline" : "default"}
                                    >
                                      {isLocked ? "Locked" : "Unstake"}
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Stake;
