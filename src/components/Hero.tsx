
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Orb from "./Orb";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-glow-gradient z-0"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 max-w-xl">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 w-fit">
              <span className="animate-pulse-glow w-3 h-3 rounded-full bg-CRE8TAR-blue"></span>
              <span className="text-sm font-medium">Emotionally Intelligent NFT Avatars</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Your own avatar <span className="gradient-text">as an NFT</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Create, train, and evolve your digital companion with emotional intelligence.
              Mint unique NFT avatars that learn and grow with you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/mint">
                <Button className="bg-gradient-to-r from-rohum-blue to-rohum-purple">
                  Mint Avatar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/buy">
                <Button variant="outline" className="group">
                  Buy $CRE8TAR
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square max-w-md mx-auto">
              <Orb
                hoverIntensity={0.5}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </div>
            <div className="absolute inset-0 animate-float">
              <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-CRE8TAR-blue/20 to-CRE8TAR-pink/20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
