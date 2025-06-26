
import { Link } from "react-router-dom";
import { 
  Twitter, 
  Github,
  Globe,
  Mail
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary/5 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <img 
                src="/Logo_C8.png"  
                alt="CRE8TAR" 
                className="h-10 w-10 mr-2" 
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The next generation of emotionally intelligent AI companions, powered by blockchain.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/mint" className="text-muted-foreground hover:text-foreground">
                  Avatar Minting
                </Link>
              </li>
              <li>
                <Link to="/companion" className="text-muted-foreground hover:text-foreground">
                  AI Companion
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-muted-foreground hover:text-foreground">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/fusion" className="text-muted-foreground hover:text-foreground">
                  Fusion Lab
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/whitepaper" className="text-muted-foreground hover:text-foreground">
                  Whitepaper
                </Link>
              </li>
              <li>
                <a 
                  href="https://cre8tar.gitbook.io/cre8tar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Documentation
                </a>
              </li>
              <li>
                <Link to="/whitepaper" className="text-muted-foreground hover:text-foreground">
                  Token Economics
                </Link>
              </li>
              <li>
                <a 
                  href="https://cre8tar.com/api-reference" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Website</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cre8tar.com All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
