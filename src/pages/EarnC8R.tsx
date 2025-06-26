
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  CheckCircle, 
  Clock, 
  Gift,
  Users,
  Share2,
  Zap,
  Star,
  Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  reward_amount: number;
  task_type: string;
  is_active: boolean;
  created_at: string;
}

interface UserTask {
  id: string;
  task_id: string;
  completed_at: string;
  reward_claimed: boolean;
}

const EarnC8R = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchTasks();
    fetchUserTasks();
  }, [user, navigate]);

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

  const fetchUserTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserTasks(data || []);
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string, taskType: string) => {
    if (!user) return;

    setClaiming(taskId);
    
    try {
      // Check if task is already completed
      const existingTask = userTasks.find(ut => ut.task_id === taskId);
      if (existingTask) {
        toast({
          title: "Task already completed",
          description: "You have already completed this task.",
          variant: "destructive",
        });
        return;
      }

      // Mark task as completed
      const { error: taskError } = await supabase
        .from('user_tasks')
        .insert({
          user_id: user.id,
          task_id: taskId,
          reward_claimed: true
        });

      if (taskError) throw taskError;

      // Find the task to get reward amount
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Add reward to rewards table
      const { error: rewardError } = await supabase
        .from('rewards')
        .insert({
          user_id: user.id,
          amount: task.reward_amount,
          reward_type: taskType,
          description: `Completed task: ${task.title}`
        });

      if (rewardError) throw rewardError;

      // Update user's C8R balance
      const { data: profile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('c8r_balance')
        .eq('user_id', user.id)
        .single();

      if (profileFetchError) throw profileFetchError;

      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          c8r_balance: (profile.c8r_balance || 0) + task.reward_amount 
        })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      toast({
        title: "Task completed!",
        description: `You earned ${task.reward_amount} $C8R tokens!`,
      });

      // Refresh user tasks
      fetchUserTasks();
      
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClaiming(null);
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'subscription':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'plugin_add':
        return <Zap className="w-5 h-5 text-blue-500" />;
      case 'plugin_create':
        return <Zap className="w-5 h-5 text-purple-500" />;
      case 'avatar_mint':
        return <Coins className="w-5 h-5 text-green-500" />;
      case 'daily_login':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'social_share':
        return <Share2 className="w-5 h-5 text-pink-500" />;
      case 'referral':
        return <Users className="w-5 h-5 text-indigo-500" />;
      default:
        return <Gift className="w-5 h-5 text-gray-500" />;
    }
  };

  const isTaskCompleted = (taskId: string) => {
    return userTasks.some(ut => ut.task_id === taskId);
  };

  const getTotalEarned = () => {
    return userTasks.reduce((total, userTask) => {
      const task = tasks.find(t => t.id === userTask.task_id);
      return total + (task?.reward_amount || 0);
    }, 0);
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading tasks...</p>
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
                Earn <span className="gradient-text">$C8R Tokens</span>
              </h1>
              <p className="text-muted-foreground">
                Complete tasks and earn $C8R tokens to power your AI avatars and unlock premium features.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coins className="mr-2 h-5 w-5 text-yellow-500" />
                      Your Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasks Completed</p>
                      <p className="text-2xl font-bold text-rohum-blue">{userTasks.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-2xl font-bold text-rohum-purple">{getTotalEarned()} $C8R</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Tasks</p>
                      <p className="text-2xl font-bold text-rohum-pink">{tasks.length - userTasks.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tasks.map((task) => {
                    const completed = isTaskCompleted(task.id);
                    return (
                      <Card key={task.id} className={`${completed ? 'opacity-75' : ''}`}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getTaskIcon(task.task_type)}
                              <span className="ml-2">{task.title}</span>
                            </div>
                            <Badge variant={completed ? "secondary" : "default"}>
                              {task.reward_amount} $C8R
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {task.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              {completed ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  <span className="text-sm">Completed</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-muted-foreground">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span className="text-sm">Available</span>
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              disabled={completed || claiming === task.id}
                              onClick={() => completeTask(task.id, task.task_type)}
                              className="bg-gradient-to-r from-rohum-blue to-rohum-purple"
                            >
                              {claiming === task.id ? "Claiming..." : completed ? "Completed" : "Complete Task"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EarnC8R;
