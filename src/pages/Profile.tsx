
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { User, Circle, Coins } from "lucide-react";
import { WalletDetailsDialog } from "@/components/WalletDetailsDialog";
import { UserSettings } from "@/components/UserSettings";
import { UserActivity } from "@/components/UserActivity";
import { TransactionHistory } from "@/components/TransactionHistory";
import { NFTDetailsDialog } from "@/components/NFTDetailsDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [walletDetailsOpen, setWalletDetailsOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [nftDetailsOpen, setNftDetailsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchProfile();
    fetchNFTs();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchNFTs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('minted_nfts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNfts(data || []);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNFTClick = (nft: any) => {
    setSelectedNFT(nft);
    setNftDetailsOpen(true);
  };

  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-8 bg-primary/5">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rohum-blue to-rohum-pink p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {profile?.profile_picture_url ? (
                      <img 
                        src={profile.profile_picture_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  Welcome, <span className="gradient-text">{profile?.name || "User"}</span>
                </h1>
                <p className="text-muted-foreground mb-2">
                  {profile?.email}
                </p>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-yellow-600">
                    {profile?.c8r_balance || 0} $C8R
                  </span>
                </div>
              </div>
              <div className="md:ml-auto flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-rohum-blue text-rohum-blue hover:bg-rohum-blue/10"
                  onClick={() => setWalletDetailsOpen(true)}
                >
                  <Coins className="mr-2 h-4 w-4" />
                  Wallet Details
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="avatars" className="w-full">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4">
                <TabsTrigger value="avatars">Avatars</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="avatars" className="mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <p>Loading your avatars...</p>
                  </div>
                ) : nfts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nfts.map((nft) => (
                      <Card 
                        key={nft.id} 
                        className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                        onClick={() => handleNFTClick(nft)}
                      >
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center text-sm">
                            <span>{nft.name}</span>
                            <Circle className="w-4 h-4 text-green-500 fill-current" />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-square rounded-md overflow-hidden bg-gradient-to-br from-rohum-blue/10 to-rohum-pink/10">
                            {nft.image_url ? (
                              <img 
                                src={nft.image_url} 
                                alt={nft.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs text-muted-foreground">
                              <strong>ID:</strong> {nft.avatar_id || 'N/A'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Type:</strong> {nft.nft_type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Role:</strong> {nft.role_type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <strong>Royalty:</strong> 5%
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                          <Button variant="outline" size="sm">View Details</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>No Avatars</span>
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-square rounded-md bg-gradient-to-br from-rohum-blue/10 to-rohum-pink/10 flex items-center justify-center">
                          <User className="w-12 h-12 text-muted-foreground" />
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        <Button variant="outline" onClick={() => navigate("/mint")}>
                          Mint Avatar
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="max-w-2xl mx-auto">
                  <UserSettings profile={profile} onProfileUpdate={fetchProfile} />
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="mt-6">
                <div className="max-w-4xl mx-auto">
                  <TransactionHistory />
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-6">
                <div className="max-w-6xl mx-auto">
                  <UserActivity />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <WalletDetailsDialog open={walletDetailsOpen} onOpenChange={setWalletDetailsOpen} />
      <NFTDetailsDialog 
        nft={selectedNFT} 
        open={nftDetailsOpen} 
        onOpenChange={setNftDetailsOpen} 
      />
      
      <Footer />
    </div>
  );
};

export default Profile;
