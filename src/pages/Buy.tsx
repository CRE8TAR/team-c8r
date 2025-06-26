
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  Gift, 
  Trophy, 
  CheckCircle, 
  Clock, 
  Star,
  Users,
  Share2,
  LogIn,
  Palette,
  Puzzle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Buy = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    fetchTasks();
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('reward_amount', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('c8r_balance')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setUserBalance(profile?.c8r_balance || 0);

      // Fetch completed tasks
      const { data: userTasks, error: tasksError } = await supabase
        .from('user_tasks')
        .select('task_id, completed_at, reward_claimed')
        .eq('user_id', user.id);

      if (tasksError) throw tasksError;
      setCompletedTasks(userTasks || []);

      // Fetch total earned from rewards
      const { data: rewards, error: rewardsError } = await supabase
        .from('rewards')
        .select('amount')
        .eq('user_id', user.id);

      if (rewardsError) throw rewardsError;
      const total = rewards?.reduce((sum, reward) => sum + reward.amount, 0) || 0;
      setTotalEarned(total);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    
    try {
      // Check if user already subscribed
      const subscribeTask = tasks.find(task => task.task_type === 'referral' && task.title.includes('Subscribe'));
      const alreadyCompleted = completedTasks.some(ct => ct.task_id === subscribeTask?.id);

      if (alreadyCompleted) {
        toast({
          title: "Already Subscribed!",
          description: "You've already claimed your subscription reward.",
          variant: "destructive"
        });
        return;
      }

      // Add subscription reward
      const { error: rewardError } = await supabase
        .from('rewards')
        .insert({
          user_id: user.id,
          amount: 1000,
          reward_type: 'subscription',
          description: 'Subscription to CRE8TAR platform'
        });

      if (rewardError) throw rewardError;

      // Mark task as completed
      if (subscribeTask) {
        const { error: taskError } = await supabase
          .from('user_tasks')
          .insert({
            user_id: user.id,
            task_id: subscribeTask.id,
            reward_claimed: true
          });

        if (taskError) throw taskError;
      }

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ c8r_balance: userBalance + 1000 })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      toast({
        title: "Welcome to CRE8TAR! 🎉",
        description: "You've received 1000 $C8R tokens for subscribing!"
      });

      fetchUserData();
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error processing your subscription.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (task: any) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const alreadyCompleted = completedTasks.some(ct => ct.task_id === task.id);
    if (alreadyCompleted) {
      toast({
        title: "Task Already Completed",
        description: "You've already claimed this reward.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Add reward
      const { error: rewardError } = await supabase
        .from('rewards')
        .insert({
          user_id: user.id,
          amount: task.reward_amount,
          reward_type: 'task_completion',
          description: `Completed task: ${task.title}`
        });

      if (rewardError) throw rewardError;

      // Mark task as completed
      const { error: taskError } = await supabase
        .from('user_tasks')
        .insert({
          user_id: user.id,
          task_id: task.id,
          reward_claimed: true
        });

      if (taskError) throw taskError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ c8r_balance: userBalance + task.reward_amount })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      toast({
        title: "Task Completed! 🎉",
        description: `You've earned ${task.reward_amount} $C8R tokens!`
      });

      fetchUserData();
    } catch (error) {
      console.error('Task completion error:', error);
      toast({
        title: "Task Failed",
        description: "There was an error completing the task.",
        variant: "destructive"
      });
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'plugin_add': return <Puzzle className="w-5 h-5" />;
      case 'plugin_create': return <Palette className="w-5 h-5" />;
      case 'avatar_mint': return <Star className="w-5 h-5" />;
      case 'referral': return <Users className="w-5 h-5" />;
      case 'daily_login': return <LogIn className="w-5 h-5" />;
      case 'social_share': return <Share2 className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const isTaskCompleted = (taskId: string) => {
    return completedTasks.some(ct => ct.task_id === taskId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-12">
          <div className="container max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Earn <span className="gradient-text">$C8R Tokens</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Complete tasks and subscribe to earn C8R tokens for your avatar creation journey
              </p>
            </div>

            {user && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                  <CardContent className="p-4 text-center">
                    <Coins className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-800">{userBalance}</div>
                    <p className="text-sm text-yellow-600">Current Balance</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-800">{totalEarned}</div>
                    <p className="text-sm text-green-600">Total Earned</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800">{completedTasks.length}</div>
                    <p className="text-sm text-blue-600">Tasks Completed</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Tabs defaultValue="subscribe" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="subscribe">Subscribe & Earn</TabsTrigger>
                <TabsTrigger value="tasks">Complete Tasks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subscribe" className="mt-6">
                <Card className="bg-gradient-to-br from-rohum-blue/10 to-rohum-purple/10">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Subscribe to CRE8TAR</CardTitle>
                    <CardDescription>
                      Get instant access to the platform and receive 1000 $C8R tokens
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold gradient-text mb-2">1000</div>
                      <div className="text-lg text-muted-foreground">$C8R Tokens</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Instant token rewards</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Full platform access</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Priority support</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleSubscribe}
                      disabled={loading || (user && completedTasks.some(ct => tasks.find(t => t.id === ct.task_id)?.title.includes('Subscribe')))}
                      className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple text-lg py-6"
                    >
                      {loading ? "Processing..." : 
                       user && completedTasks.some(ct => tasks.find(t => t.id === ct.task_id)?.title.includes('Subscribe')) ? 
                       "Already Subscribed" : "Subscribe to CRE8TAR"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.filter(task => !task.title.includes('Subscribe')).map((task) => {
                    const completed = isTaskCompleted(task.id);
                    return (
                      <Card key={task.id} className={`transition-all ${completed ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getTaskIcon(task.task_type)}
                              <div>
                                <CardTitle className="text-lg">{task.title}</CardTitle>
                                <CardDescription>{task.description}</CardDescription>
                              </div>
                            </div>
                            <Badge variant={completed ? "default" : "secondary"} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                              {task.reward_amount} $C8R
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button 
                            onClick={() => handleCompleteTask(task)}
                            disabled={completed || !user}
                            className={`w-full ${completed ? 'bg-green-500' : 'bg-gradient-to-r from-rohum-blue to-rohum-purple'}`}
                          >
                            {completed ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Completed
                              </>
                            ) : !user ? (
                              "Login to Complete"
                            ) : (
                              <>
                                <Clock className="mr-2 h-4 w-4" />
                                Complete Task
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>

            {!user && (
              <div className="text-center mt-8 p-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-4">
                  Login to your account to start earning $C8R tokens
                </p>
                <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-rohum-blue to-rohum-purple">
                  Login / Sign Up
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Buy;
