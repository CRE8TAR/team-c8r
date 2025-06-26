
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ShinyText from "@/components/ui/ShinyText";

interface ComingSoonProps {
  children: React.ReactNode;
}

const ComingSoon = ({ children }: ComingSoonProps) => {
  const [showBeta, setShowBeta] = useState(false);

  if (showBeta) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <ShinyText 
                text="Coming Soon" 
                disabled={false} 
                speed={3} 
                className="text-4xl font-bold"
              />
            </div>
            <p className="text-muted-foreground mb-6">
              This feature is currently under development. Check out our beta version!
            </p>
            <Button 
              onClick={() => setShowBeta(true)}
              className="bg-gradient-to-r from-rohum-blue to-rohum-purple"
            >
              Check Beta
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ComingSoon;
