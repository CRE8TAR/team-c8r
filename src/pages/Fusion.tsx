
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Layers, ArrowRight } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

const FusionContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-8 bg-primary/5">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">
                Avatar <span className="gradient-text">Fusion Lab</span>
              </h1>
              <p className="text-muted-foreground">
                Combine two avatars to create a hybrid with enhanced emotional intelligence.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container">
            <Card className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Fusion Process</CardTitle>
                <CardDescription>
                  Select two avatars from your collection to fuse them together.
                  The resulting hybrid will inherit traits from both parent avatars.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div className="md:col-span-3">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-rohum-blue/20 to-rohum-pink/20 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rohum-blue/20 to-rohum-pink/20 mx-auto mb-4"></div>
                        <p className="font-medium">Select Avatar 1</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Connect wallet to view your avatars
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-1 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="md:col-span-3">
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-rohum-blue/20 to-rohum-pink/20 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rohum-blue/20 to-rohum-pink/20 mx-auto mb-4"></div>
                        <p className="font-medium">Select Avatar 2</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Connect wallet to view your avatars
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8 mb-4">
                  <div className="flex items-center">
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="max-w-xs mx-auto">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-rohum-blue/10 to-rohum-pink/10 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rohum-blue/5 to-rohum-pink/5 mx-auto mb-4"></div>
                      <p className="font-medium">Fusion Result</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Select two avatars to preview the result
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Fusion cost: 250 $C8R tokens + both selected avatars will be burned
                  </p>
                  <Button className="bg-gradient-to-r from-rohum-blue to-rohum-purple" disabled>
                    Begin Fusion
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const Fusion = () => {
  return (
    <ComingSoon>
      <FusionContent />
    </ComingSoon>
  );
};

export default Fusion;
