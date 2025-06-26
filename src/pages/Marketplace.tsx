import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid, List } from "lucide-react";
import { NFTDetailsCard } from "@/components/NFTDetailsCard";
import ComingSoon from "@/components/ComingSoon";
import SplashCursor from "@/components/SplashCursor";

// Sample NFT data
const sampleNFTs = [
  {
    id: "1",
    name: "Science Teacher Avatar",
    description: "An empathetic science educator with deep knowledge of physics and chemistry",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    avatar_id: "SCI_001",
    created_at: "2024-01-15T10:30:00Z",
    nft_type: "ERC-1155",
    royalty_percentage: 5,
    model_source: "custom-3d",
    voice_sample: "female-professional",
    language: "english",
    role_type: "educator",
    gesture_package: "academic-professional",
    personality_traits: ["empathetic", "knowledgeable", "patient", "encouraging"],
    price: 250
  },
  {
    id: "2", 
    name: "Creative Writer Assistant",
    description: "A storytelling companion with emotional intelligence and creative flair",
    image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    avatar_id: "WRT_002",
    created_at: "2024-02-20T14:45:00Z",
    nft_type: "ERC-1155",
    royalty_percentage: 7,
    model_source: "ai-generated",
    voice_sample: "neutral-creative",
    language: "english",
    role_type: "creative-assistant",
    gesture_package: "expressive-artistic",
    personality_traits: ["creative", "inspiring", "intuitive", "supportive"],
    price: 300
  },
  {
    id: "3",
    name: "Fitness Trainer Bot",
    description: "Motivational fitness coach with progress tracking capabilities",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    avatar_id: "FIT_003",
    created_at: "2024-03-10T09:15:00Z",
    nft_type: "ERC-1155",
    royalty_percentage: 6,
    model_source: "motion-capture",
    voice_sample: "energetic-motivational",
    language: "english",
    role_type: "fitness-trainer",
    gesture_package: "athletic-dynamic",
    personality_traits: ["motivational", "energetic", "disciplined", "supportive"],
    price: 275
  }
];

const pluginCategories = [
  { 
    name: "Science Education Teacher", 
    description: "Explain scientific concepts with empathy and curiosity",
    icon: "science",
    price: 250 
  },
  { 
    name: "Advertiser Plugin", 
    description: "Craft persuasive and emotionally resonant ads",
    icon: "megaphone", 
    price: 300 
  },
  { 
    name: "News Reader Plugin", 
    description: "Present news with emotional depth and awareness",
    icon: "newspaper", 
    price: 275 
  },
  { 
    name: "Programming Assistant", 
    description: "Provide coding help with moral support",
    icon: "code", 
    price: 350 
  },
  { 
    name: "Yoga Instructor", 
    description: "Personalized yoga guidance with stress-aware tone",
    icon: "yoga", 
    price: 225 
  },
  { 
    name: "Fitness Trainer Plugin", 
    description: "Motivational coaching with progress tracking",
    icon: "fitness", 
    price: 275 
  },
  { 
    name: "Singing Coach", 
    description: "Learn vocal techniques with confidence-boosting duets",
    icon: "mic", 
    price: 300 
  },
  { 
    name: "Medical Assistant", 
    description: "Health tracking with empathetic support",
    icon: "medkit", 
    price: 400 
  },
  { 
    name: "Creative Writer Plugin", 
    description: "Story and essay writing with emotional intelligence",
    icon: "pencil", 
    price: 250 
  },
  { 
    name: "Multilingual Communicator", 
    description: "Communicate across languages with cultural empathy",
    icon: "globe", 
    price: 450 
  }
];

const MarketplaceContent = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlugin, setSelectedPlugin] = useState<null | typeof pluginCategories[0]>(null);
  const [selectedNFT, setSelectedNFT] = useState<null | typeof sampleNFTs[0]>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNFTDetailsOpen, setIsNFTDetailsOpen] = useState(false);

  const filteredPlugins = pluginCategories.filter(plugin => 
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNFTs = sampleNFTs.filter(nft => 
    nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (plugin: typeof pluginCategories[0]) => {
    setSelectedPlugin(plugin);
    setIsDetailsOpen(true);
  };

  const handleViewNFTDetails = (nft: typeof sampleNFTs[0]) => {
    setSelectedNFT(nft);
    setIsNFTDetailsOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SplashCursor />
      <Header />
      
      <main className="flex-grow">
        <section className="py-8 bg-primary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">
                Plugin <span className="gradient-text">Marketplace</span>
              </h1>
              <p className="text-muted-foreground">
                Enhance your avatar's emotional intelligence with specialized plugins and NFTs.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="discover" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                  <TabsTrigger value="nfts">NFTs</TabsTrigger>
                  <TabsTrigger value="my-plugins">My Plugins</TabsTrigger>
                  <TabsTrigger value="create">Create Plugin</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")}>
                      <Grid className={`h-5 w-5 ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewMode("list")}>
                      <List className={`h-5 w-5 ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`} />
                    </Button>
                  </div>
                  
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-8" 
                      placeholder="Search plugins..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="discover">
                <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"} gap-8`}>
                  {filteredPlugins.map((plugin, index) => (
                    <Card 
                      key={index} 
                      className="group relative overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 transform-gpu perspective-1000"
                      style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-rohum-blue/5 to-rohum-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <CardHeader className={`${viewMode === "list" ? "flex flex-row items-center justify-between" : "text-center"} relative z-10`}>
                        <div className={viewMode === "grid" ? "space-y-2" : ""}>
                          <CardTitle className={`${viewMode === "grid" ? "text-lg" : "text-xl"} font-semibold text-foreground group-hover:text-primary transition-colors duration-300`}>
                            {plugin.name}
                          </CardTitle>
                          <CardDescription className={`${viewMode === "grid" ? "text-sm line-clamp-2" : "text-base"} text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300`}>
                            {plugin.description}
                          </CardDescription>
                        </div>
                        {viewMode === "list" && (
                          <Button 
                            onClick={() => handleViewDetails(plugin)}
                            className="bg-gradient-to-r from-rohum-blue to-rohum-pink hover:from-rohum-pink hover:to-rohum-blue transition-all duration-300"
                          >
                            View Details
                          </Button>
                        )}
                      </CardHeader>
                      
                      {viewMode === "grid" && (
                        <>
                          <CardContent className="text-center relative z-10">
                            <div className="aspect-square rounded-xl bg-gradient-to-br from-rohum-blue/20 via-rohum-purple/20 to-rohum-pink/20 flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10 group-hover:scale-105 transition-transform duration-300">
                              <span className="text-3xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">
                                #{index + 1}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground/80">Category</span>
                                <span className="text-xs font-medium text-primary truncate max-w-[120px]">
                                  {plugin.name.split(' ')[0]}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground/80">Type</span>
                                <span className="text-xs font-medium text-accent truncate">
                                  AI Plugin
                                </span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center pt-4 relative z-10 border-t border-white/10">
                            <span className="font-bold text-lg gradient-text">
                              {plugin.price} $C8R
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(plugin)}
                              className="bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-foreground hover:text-primary transition-all duration-300 backdrop-blur-sm"
                            >
                              View Details
                            </Button>
                          </CardFooter>
                        </>
                      )}
                    </Card>
                  ))}
                </div>
                {filteredPlugins.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="backdrop-blur-xl bg-white/5 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl p-8 max-w-md mx-auto">
                      <p className="text-lg">No plugins match your search criteria.</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="nfts">
                <div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"} gap-8`}>
                  {filteredNFTs.map((nft) => (
                    <Card 
                      key={nft.id}
                      onClick={() => handleViewNFTDetails(nft)}
                      className="group relative overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 transform-gpu perspective-1000 cursor-pointer"
                      style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-rohum-blue/5 to-rohum-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <CardHeader className="text-center relative z-10">
                        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {nft.name}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2 text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                          {nft.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="text-center relative z-10">
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-rohum-blue/20 via-rohum-purple/20 to-rohum-pink/20 flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                          <img 
                            src={nft.image_url}
                            alt={nft.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground/80">Type</span>
                            <span className="text-xs font-medium text-primary truncate">
                              {nft.role_type}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground/80">Language</span>
                            <span className="text-xs font-medium text-accent truncate capitalize">
                              {nft.language}
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex justify-between items-center pt-4 relative z-10 border-t border-white/10">
                        <span className="font-bold text-lg gradient-text">
                          {nft.price} $C8R
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-foreground hover:text-primary transition-all duration-300 backdrop-blur-sm"
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {filteredNFTs.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <div className="backdrop-blur-xl bg-white/5 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-xl p-8 max-w-md mx-auto">
                      <p className="text-lg">No NFTs match your search criteria.</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="my-plugins">
                <div className="text-center py-16">
                  <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl p-8 max-w-md mx-auto shadow-2xl">
                    <p className="text-muted-foreground mb-4">
                      Connect your wallet to view your plugins.
                    </p>
                    <Button className="bg-gradient-to-r from-rohum-blue to-rohum-pink hover:from-rohum-pink hover:to-rohum-blue transition-all duration-300">
                      Connect Wallet
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="create">
                <div className="text-center py-16">
                  <div className="backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl p-8 max-w-md mx-auto shadow-2xl">
                    <p className="text-muted-foreground mb-4">
                      Coming soon! Developer tools for creating and minting new plugins.
                    </p>
                    <Button className="bg-gradient-to-r from-rohum-blue to-rohum-pink opacity-50" disabled>
                      Get Notified
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      {selectedPlugin && (
        <div>
          {/* Plugin details dialog would go here */}
        </div>
      )}

      {selectedNFT && (
        <NFTDetailsCard
          nft={selectedNFT}
          open={isNFTDetailsOpen}
          onOpenChange={setIsNFTDetailsOpen}
        />
      )}
      
      <Footer />
    </div>
  );
};

const Marketplace = () => {
  return (
    <ComingSoon>
      <MarketplaceContent />
    </ComingSoon>
  );
};

export default Marketplace;
