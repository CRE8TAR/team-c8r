
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  User, 
  Coins, 
  Activity, 
  Clock, 
  Settings,
  Star
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ActivityLog {
  id: string;
  type: string;
  action: string;
  details: string;
  timestamp: string;
  amount?: number;
  status?: string;
}

export function UserActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAvatarsMinted: 0,
    totalTasksCompleted: 0,
    totalRewardsEarned: 0,
    totalStaked: 0,
    lastLoginDate: null as string | null,
    accountCreatedDate: null as string | null
  });

  useEffect(() => {
    if (user) {
      fetchUserActivities();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserActivities = async () => {
    if (!user) return;

    try {
      const activities: ActivityLog[] = [];

      // Fetch minting activities
      const { data: nfts } = await supabase
        .from('minted_nfts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      nfts?.forEach(nft => {
        activities.push({
          id: nft.id,
          type: 'minting',
          action: 'Avatar Minted',
          details: `Minted avatar "${nft.name}" (${nft.nft_type})`,
          timestamp: nft.created_at,
          status: 'completed'
        });
      });

      // Fetch transaction activities
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      transactions?.forEach(transaction => {
        activities.push({
          id: transaction.id,
          type: transaction.type,
          action: getTransactionAction(transaction.type),
          details: transaction.description || 'No description',
          timestamp: transaction.created_at,
          amount: transaction.amount,
          status: 'completed'
        });
      });

      // Fetch staking activities
      const { data: stakingData } = await supabase
        .from('staking')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      stakingData?.forEach(stake => {
        activities.push({
          id: stake.id,
          type: 'staking',
          action: stake.is_active ? 'Staking Active' : 'Staking Completed',
          details: `Staked ${stake.amount} $C8R until ${format(new Date(stake.unlock_date), 'PPP')}`,
          timestamp: stake.created_at,
          amount: stake.amount,
          status: stake.is_active ? 'active' : 'completed'
        });
      });

      // Fetch completed tasks
      const { data: userTasks } = await supabase
        .from('user_tasks')
        .select(`
          *,
          tasks (
            title,
            description,
            reward_amount
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      userTasks?.forEach(userTask => {
        activities.push({
          id: userTask.id,
          type: 'task',
          action: 'Task Completed',
          details: `Completed: ${userTask.tasks?.title}`,
          timestamp: userTask.completed_at,
          amount: userTask.tasks?.reward_amount,
          status: userTask.reward_claimed ? 'claimed' : 'pending'
        });
      });

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Get avatar count
      const { count: avatarCount } = await supabase
        .from('minted_nfts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get task completion count
      const { count: taskCount } = await supabase
        .from('user_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get total rewards earned
      const { data: rewards } = await supabase
        .from('rewards')
        .select('amount')
        .eq('user_id', user.id);

      const totalRewards = rewards?.reduce((sum, reward) => sum + reward.amount, 0) || 0;

      // Get total staked amount
      const { data: stakingData } = await supabase
        .from('staking')
        .select('amount')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const totalStaked = stakingData?.reduce((sum, stake) => sum + stake.amount, 0) || 0;

      // Get profile creation date (approximate last login)
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at, updated_at')
        .eq('user_id', user.id)
        .single();

      setStats({
        totalAvatarsMinted: avatarCount || 0,
        totalTasksCompleted: taskCount || 0,
        totalRewardsEarned: totalRewards,
        totalStaked: totalStaked,
        lastLoginDate: profile?.updated_at || null,
        accountCreatedDate: profile?.created_at || null
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getTransactionAction = (type: string) => {
    switch (type) {
      case 'mint': return 'Avatar Minting';
      case 'purchase': return 'Token Purchase';
      case 'earning': return 'Reward Earned';
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdrawal';
      default: return 'Transaction';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'minting': return <User className="h-4 w-4" />;
      case 'task': return <Star className="h-4 w-4" />;
      case 'staking': return <Coins className="h-4 w-4" />;
      case 'mint':
      case 'purchase':
      case 'earning':
      case 'deposit':
      case 'withdrawal':
        return <Coins className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'claimed':
        return <Badge variant="default" className="bg-blue-500">Claimed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Activity...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-rohum-blue" />
              <div>
                <p className="text-2xl font-bold">{stats.totalAvatarsMinted}</p>
                <p className="text-xs text-muted-foreground">Avatars Minted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTasksCompleted}</p>
                <p className="text-xs text-muted-foreground">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalRewardsEarned}</p>
                <p className="text-xs text-muted-foreground">$C8R Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalStaked}</p>
                <p className="text-xs text-muted-foreground">$C8R Staked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Account Created:</p>
              <p className="font-medium">
                {stats.accountCreatedDate 
                  ? format(new Date(stats.accountCreatedDate), 'PPP p')
                  : 'Unknown'
                }
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Activity:</p>
              <p className="font-medium">
                {stats.lastLoginDate 
                  ? format(new Date(stats.lastLoginDate), 'PPP p')
                  : 'Unknown'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity.type)}
                          <span className="font-medium">{activity.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {activity.details}
                        </span>
                      </TableCell>
                      <TableCell>
                        {activity.amount && (
                          <span className={`font-medium ${
                            activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {activity.amount > 0 ? '+' : ''}{activity.amount} $C8R
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(activity.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(activity.timestamp), 'PPp')}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
