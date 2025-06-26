
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Vote, Users, Clock, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Proposal {
  id: string;
  title: string;
  description: string;
  created_by: string;
  status: string;
  votes_for: number;
  votes_against: number;
  end_date: string;
  created_at: string;
}

interface UserVote {
  proposal_id: string;
  vote_type: string;
  voting_power: number;
}

const Governance = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [votingPower, setVotingPower] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // New proposal form
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    endDate: ""
  });

  useEffect(() => {
    if (user) {
      fetchProposals();
      fetchUserVotes();
      fetchVotingPower();
    }
  }, [user]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserVotes(data || []);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const fetchVotingPower = async () => {
    if (!user) return;

    try {
      // Calculate voting power based on staked tokens
      const { data: stakingData, error: stakingError } = await supabase
        .from('staking')
        .select('amount')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (stakingError) throw stakingError;

      const totalStaked = stakingData?.reduce((sum, position) => sum + position.amount, 0) || 0;
      setVotingPower(totalStaked);
    } catch (error) {
      console.error('Error fetching voting power:', error);
    }
  };

  const createProposal = async () => {
    if (!user || !newProposal.title || !newProposal.description || !newProposal.endDate) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (votingPower < 1000) {
      toast({
        title: "Insufficient Voting Power",
        description: "You need at least 1000 staked $C8R to create proposals.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('proposals')
        .insert({
          title: newProposal.title,
          description: newProposal.description,
          created_by: user.id,
          end_date: newProposal.endDate
        });

      if (error) throw error;

      toast({
        title: "Proposal Created!",
        description: "Your proposal has been submitted for voting."
      });

      setNewProposal({ title: "", description: "", endDate: "" });
      fetchProposals();
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create proposal.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const vote = async (proposalId: string, voteType: 'for' | 'against') => {
    if (!user || votingPower === 0) {
      toast({
        title: "Cannot Vote",
        description: "You need staked tokens to vote.",
        variant: "destructive"
      });
      return;
    }

    // Check if user already voted
    const existingVote = userVotes.find(v => v.proposal_id === proposalId);
    if (existingVote) {
      toast({
        title: "Already Voted",
        description: "You have already voted on this proposal.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Cast vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          proposal_id: proposalId,
          user_id: user.id,
          vote_type: voteType,
          voting_power: votingPower
        });

      if (voteError) throw voteError;

      // Update proposal vote counts
      const proposal = proposals.find(p => p.id === proposalId);
      if (proposal) {
        const updateField = voteType === 'for' ? 'votes_for' : 'votes_against';
        const newCount = (voteType === 'for' ? proposal.votes_for : proposal.votes_against) + votingPower;

        const { error: updateError } = await supabase
          .from('proposals')
          .update({ [updateField]: newCount })
          .eq('id', proposalId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Vote Recorded!",
        description: `Your ${voteType} vote has been recorded with ${votingPower} voting power.`
      });

      fetchProposals();
      fetchUserVotes();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Voting Failed",
        description: "There was an error recording your vote.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProposalStatus = (proposal: Proposal) => {
    const endDate = new Date(proposal.end_date);
    const now = new Date();
    
    if (now > endDate) {
      if (proposal.votes_for > proposal.votes_against) {
        return { status: "Passed", color: "bg-green-500" };
      } else {
        return { status: "Rejected", color: "bg-red-500" };
      }
    }
    
    return { status: "Active", color: "bg-blue-500" };
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="mb-4">Please sign in to access governance features.</p>
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
                <span className="gradient-text">Governance</span>
              </h1>
              <p className="text-muted-foreground">
                Participate in CRE8TAR governance by voting on proposals and shaping the future of the platform.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Vote className="mr-2 h-5 w-5" />
                      Your Power
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-rohum-blue">{votingPower}</p>
                      <p className="text-sm text-muted-foreground">Voting Power</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Based on staked tokens
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Proposal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Proposal</DialogTitle>
                      <DialogDescription>
                        Submit a proposal for the community to vote on. Requires 1000+ staked tokens.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={newProposal.title}
                          onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Proposal title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={newProposal.description}
                          onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Detailed description of the proposal"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                          type="datetime-local"
                          value={newProposal.endDate}
                          onChange={(e) => setNewProposal(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                      <Button
                        onClick={createProposal}
                        disabled={isLoading || votingPower < 1000}
                        className="w-full"
                      >
                        {isLoading ? "Creating..." : "Create Proposal"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Proposals */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Proposals</CardTitle>
                    <CardDescription>
                      Vote on community proposals to shape the future of CRE8TAR
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {proposals.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No proposals yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Be the first to create a proposal!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {proposals.map((proposal) => {
                          const totalVotes = proposal.votes_for + proposal.votes_against;
                          const forPercentage = totalVotes > 0 ? (proposal.votes_for / totalVotes) * 100 : 0;
                          const userVote = userVotes.find(v => v.proposal_id === proposal.id);
                          const { status, color } = getProposalStatus(proposal);
                          const endDate = new Date(proposal.end_date);
                          const isActive = new Date() <= endDate;

                          return (
                            <div key={proposal.id} className="border rounded-lg p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold mb-2">{proposal.title}</h3>
                                  <p className="text-muted-foreground text-sm mb-3">{proposal.description}</p>
                                </div>
                                <Badge className={`${color} text-white`}>
                                  {status}
                                </Badge>
                              </div>

                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span>For: {proposal.votes_for}</span>
                                  <span>Against: {proposal.votes_against}</span>
                                </div>
                                <Progress value={forPercentage} className="h-2" />
                                
                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                  <span>Ends: {endDate.toLocaleDateString()}</span>
                                  <span>Total votes: {totalVotes}</span>
                                </div>

                                {isActive && !userVote && votingPower > 0 && (
                                  <div className="flex space-x-2 pt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => vote(proposal.id, 'for')}
                                      disabled={isLoading}
                                      className="flex-1"
                                    >
                                      <ThumbsUp className="mr-1 h-4 w-4" />
                                      Vote For
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => vote(proposal.id, 'against')}
                                      disabled={isLoading}
                                      className="flex-1"
                                    >
                                      <ThumbsDown className="mr-1 h-4 w-4" />
                                      Vote Against
                                    </Button>
                                  </div>
                                )}

                                {userVote && (
                                  <div className="pt-2">
                                    <Badge variant="secondary">
                                      You voted {userVote.vote_type} with {userVote.voting_power} power
                                    </Badge>
                                  </div>
                                )}

                                {!isActive && (
                                  <div className="pt-2">
                                    <Badge variant="outline">
                                      Voting ended
                                    </Badge>
                                  </div>
                                )}
                              </div>
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

export default Governance;
