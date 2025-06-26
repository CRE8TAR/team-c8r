
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Whitepaper = () => {
  const tokenDistribution = [
    { name: 'Team', value: 15, amount: '150M', color: '#8884d8' },
    { name: 'Advisors', value: 5, amount: '50M', color: '#82ca9d' },
    { name: 'Public Sale', value: 20, amount: '200M', color: '#ffc658' },
    { name: 'Private Sale', value: 15, amount: '150M', color: '#ff7300' },
    { name: 'Ecosystem Fund', value: 25, amount: '250M', color: '#0088fe' },
    { name: 'Liquidity', value: 10, amount: '100M', color: '#00c49f' },
    { name: 'Marketing', value: 10, amount: '100M', color: '#ffbb28' }
  ];

  const c8tDistribution = [
    { name: 'Ecosystem & Community', value: 30, color: '#8884d8' },
    { name: 'Team & Founders', value: 25, color: '#82ca9d' },
    { name: 'Partnerships & Development', value: 20, color: '#ffc658' },
    { name: 'Public Sale', value: 15, color: '#ff7300' },
    { name: 'Reserve & Treasury', value: 10, color: '#0088fe' }
  ];

  const roadmapData = [
    { quarter: 'Q1 2025', progress: 75, status: 'In Progress' },
    { quarter: 'Q2 2025', progress: 25, status: 'Planning' },
    { quarter: 'Q3 2025', progress: 10, status: 'Planning' },
    { quarter: '2026-2030', progress: 0, status: 'Future' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">
            CRE8TAR Whitepaper
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building the future of emotionally intelligent digital interactions through AI-powered avatars and Web3 ownership
          </p>
          <Badge variant="outline" className="text-lg px-4 py-2">Version 1.0 • May 2025</Badge>
        </div>

        {/* Executive Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">1. Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              CRE8TAR is a next-generation AI and Web3-powered platform designed to humanize digital interaction through 
              emotionally intelligent avatars. Our mission is to build a transformative ecosystem that blends creativity, 
              AI, Web3, and blockchain ownership to create immersive, decentralized experiences across education, 
              entertainment, healthcare, and urban infrastructure.
            </p>
          </CardContent>
        </Card>

        {/* Vision & Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">2. Vision & Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Vision:</h3>
              <p>
                To build a future where emotionally intelligent avatars enhance every aspect of human life making 
                digital interaction more natural, immersive, and emotionally engaging.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Mission:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To empower creators and users with ownership through NFTs.</li>
                <li>To decentralize digital identity using blockchain.</li>
                <li>To provide AI-powered avatars that foster real, emotional connections.</li>
                <li>To drive cultural restoration, education, and innovation via immersive tech.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Core Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">4. Core Features (MVP)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">AI Avatar Anchors</h4>
                  <p className="text-sm text-muted-foreground">Real-time news delivery via emotional, AI-powered avatars.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Emotion-Driven Ad Avatars</h4>
                  <p className="text-sm text-muted-foreground">Interactive ad experiences using expressive AI avatars.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">AI Blogger</h4>
                  <p className="text-sm text-muted-foreground">A digital influencer that generates content with creativity and emotional nuance.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">NFT Marketplace</h4>
                  <p className="text-sm text-muted-foreground">Enables trading and ownership of AI avatars and digital assets.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">5. Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Frontend & Backend</h4>
                <ul className="space-y-2">
                  <li><Badge variant="secondary">React</Badge> <Badge variant="secondary">Vite</Badge></li>
                  <li><Badge variant="secondary">Node.js</Badge> <Badge variant="secondary">MongoDB</Badge></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">AI & Blockchain</h4>
                <ul className="space-y-2">
                  <li><Badge variant="secondary">Emotion Recognition</Badge> <Badge variant="secondary">NLP</Badge></li>
                  <li><Badge variant="secondary">L1X Blockchain</Badge> <Badge variant="secondary">ERC-721/720</Badge></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Economics Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>CRT Token Distribution</CardTitle>
              <CardDescription>Total Supply: 1,000,000,000 CRT</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tokenDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {tokenDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>C8T Token Distribution</CardTitle>
              <CardDescription>Total Supply: 1,000,000,000 C8T</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={c8tDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {c8tDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Token Utility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Token Utility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    🏛️ Governance
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    C8R holders can participate in platform governance by voting on proposals related to feature development, economic models, and protocol upgrades.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    ⚡ Avatar Enhancement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Spend C8R to purchase emotional plugins, visual upgrades, and specialized features for your avatars.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    🎨 Creator Rewards
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Creators earn C8R when their avatar plugins or templates are used by other community members.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    💸 Transaction Fees
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    C8R is used to pay transaction fees when avatars are minted, traded, or evolved on the platform.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">10. Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {roadmapData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{item.quarter}</h4>
                  <Badge variant={item.status === 'In Progress' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </div>
                <Progress value={item.progress} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {item.quarter === 'Q1 2025' && 'MVP launch (AI Anchors, NFT marketplace, Ad avatars), Begin AI Blogger integration'}
                  {item.quarter === 'Q2 2025' && 'Complete AI Blogger, NFT Avatar Minting & Marketplace expansion'}
                  {item.quarter === 'Q3 2025' && 'Launch AI identity wallet & DAO governance, Start physical avatar research'}
                  {item.quarter === '2026-2030' && 'Global scale-up across cities, Partnerships with governments and institutions'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">12. Contact & Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Website</h4>
                <a href="https://cre8tar.vercel.app" className="text-primary hover:underline">
                  cre8tar.vercel.app
                </a>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Documentation</h4>
                <a href="https://cre8tar.gitbook.io/cre8tar" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  GitBook Docs
                </a>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">Email</h4>
                <a href="mailto:team@cre8tar.ai" className="text-primary hover:underline">
                  team@cre8tar.ai
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center p-8 bg-gradient-to-r from-rohum-blue/10 to-rohum-purple/10 rounded-lg">
          <p className="text-lg font-medium">
            CRE8TAR is not just a project, it is a movement towards emotionally intelligent, decentralized, and creator-owned digital futures.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Whitepaper;
