
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, Users, Clock, Plus, ThumbsUp, ThumbsDown, TrendingUp, Lock, Unlock, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ComingSoon from "@/components/ComingSoon";

const StakeGovernanceContent = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="mb-4">Please sign in to access staking and governance features.</p>
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
                Stake & <span className="gradient-text">Governance</span>
              </h1>
              <p className="text-muted-foreground">
                Stake your $C8R tokens to earn rewards and participate in platform governance.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <Tabs defaultValue="stake" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stake">Staking</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stake" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                          <p className="text-2xl font-bold text-rohum-blue">0 $C8R</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Staked</p>
                          <p className="text-2xl font-bold text-rohum-purple">0 $C8R</p>
                        </div>
                      </CardContent>
                    </Card>

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
                          <Input type="number" placeholder="Enter amount" />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Staking Period</label>
                          <select className="w-full mt-1 p-2 border rounded-md">
                            <option value="30">30 Days (8% APY)</option>
                            <option value="90">90 Days (12% APY)</option>
                            <option value="180">180 Days (18% APY)</option>
                            <option value="365">365 Days (25% APY)</option>
                          </select>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple">
                          Stake Tokens
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Staking Positions</CardTitle>
                        <CardDescription>
                          Manage your active and completed staking positions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No staking positions yet</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Start staking to earn rewards!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="governance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                          <p className="text-2xl font-bold text-rohum-blue">0</p>
                          <p className="text-sm text-muted-foreground">Voting Power</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Based on staked tokens
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Button className="w-full bg-gradient-to-r from-rohum-blue to-rohum-purple">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Proposal
                    </Button>
                  </div>

                  <div className="lg:col-span-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Active Proposals</CardTitle>
                        <CardDescription>
                          Vote on community proposals to shape the future of CRE8TAR
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No proposals yet</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Be the first to create a proposal!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const StakeGovernance = () => {
  return (
    <ComingSoon>
      <StakeGovernanceContent />
    </ComingSoon>
  );
};

export default StakeGovernance;
