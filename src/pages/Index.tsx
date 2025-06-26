
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* Video Teaser Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl font-bold mb-4">
                See CRE8TAR in <span className="gradient-text">Action</span>
              </h2>
              <p className="text-muted-foreground">
                Watch how our emotionally intelligent avatars interact and evolve over time.
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto aspect-video bg-black/20 rounded-xl overflow-hidden flex items-center justify-center">
              {/* This would be replaced with an actual video player */}
              <div className="text-center p-8">
                <p className="text-lg font-medium mb-4">Video Teaser Coming Soon</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Our team is putting final touches on an amazing demo video. 
                  Check back soon to see CRE8TAR avatars in action.
                </p>
                <Button>
                  Get Notified
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center glass-card p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Create Your <span className="gradient-text">Emotional Avatar</span>?
              </h2>
              <p className="text-muted-foreground mb-8">
                Mint your unique NFT avatar and start exploring the world of emotional AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/mint">
                  <Button className="bg-gradient-to-r from-rohum-blue to-rohum-purple">
                    Mint Avatar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/companion">
                  <Button variant="outline">
                    Try AI Companion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
