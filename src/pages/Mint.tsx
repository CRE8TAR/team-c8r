
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AvatarCreationForm } from "@/components/AvatarCreationForm";
import { MintedAvatarDisplay } from "@/components/MintedAvatarDisplay";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const MINT_COST = 100; // Cost in C8R

const Mint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [mintedAvatar, setMintedAvatar] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserBalance();
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

  const updateUserBalance = async (newBalance: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ c8r_balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;
      setUserBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  };

  const createTransaction = async (type: string, amount: number, description: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type,
          amount,
          description
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleMint = async (formData: any) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (userBalance < MINT_COST) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${MINT_COST} $C8R to mint an avatar. Your current balance is ${userBalance} $C8R.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let imageUrl = "";
      
      // Upload image to storage if provided
      if (formData.imageFile) {
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('nft-images')
          .upload(fileName, formData.imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('nft-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      // Save NFT to database with fixed 5% royalty
      const { error: insertError } = await supabase
        .from('minted_nfts')
        .insert({
          user_id: user.id,
          name: formData.name,
          avatar_id: formData.avatarId,
          description: formData.description,
          image_url: imageUrl,
          model_source: formData.modelSource,
          voice_sample: formData.voiceSample,
          personality_traits: formData.personalityTraits,
          role_type: formData.roleType,
          language: formData.language,
          gesture_package: formData.gesturePackage,
          nft_type: formData.nftType,
          royalty_percentage: 5 // Fixed at 5%
        });

      if (insertError) {
        throw insertError;
      }

      // Deduct C8R balance and create transaction
      await updateUserBalance(userBalance - MINT_COST);
      await createTransaction('mint', -MINT_COST, `Minted avatar: ${formData.name}`);

      console.log("Minting avatar with data:", formData);
      setMintedAvatar({ ...formData, imageUrl });
      
      toast({
        title: "Avatar Minted Successfully!",
        description: `Your avatar NFT has been created! ${MINT_COST} $C8R has been deducted from your balance.`
      });
      
    } catch (error) {
      console.error("Failed to mint avatar:", error);
      toast({
        title: "Minting Failed",
        description: "There was an error minting your avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnother = () => {
    setMintedAvatar(null);
    fetchUserBalance(); // Refresh balance
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-12">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl font-bold mb-4">
                Mint Your <span className="gradient-text">Avatar NFT</span>
              </h1>
              <p className="text-muted-foreground">
                Create a unique AI-powered avatar NFT with customizable traits, voice, and personality.
                Your avatar can generate content, earn revenue, and be deployed across platforms.
              </p>
            </div>

            {!mintedAvatar ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <AvatarCreationForm onMint={handleMint} isLoading={isLoading} />
                </div>
                
                <div className="space-y-6">
                  <div className="sticky top-24">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-2">Minting Cost</h3>
                      <p className="text-2xl font-bold text-rohum-blue">{MINT_COST} $C8R</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your balance: {userBalance} $C8R
                      </p>
                      {userBalance < MINT_COST && (
                        <p className="text-sm text-red-500 mt-2">
                          Insufficient balance to mint
                        </p>
                      )}
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
                      <h3 className="font-semibold mb-2 text-blue-800">What You Get</h3>
                      <ul className="text-sm space-y-1 text-blue-700">
                        <li>• ERC-721 or ERC-1155 NFT ownership</li>
                        <li>• AI content generation</li>
                        <li>• Revenue earning potential</li>
                        <li>• Cross-platform deployment</li>
                        <li>• Customizable personality</li>
                        <li>• 5% creator royalties (fixed)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <MintedAvatarDisplay 
                  avatarData={mintedAvatar} 
                  onCreateAnother={handleCreateAnother}
                />
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mint;
