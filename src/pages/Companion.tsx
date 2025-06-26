import {useEffect, useState} from "react";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Image, Mic, MicOff, Send} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {supabase} from "@/integrations/supabase/client";
import {useNavigate} from "react-router-dom";
import ComingSoon from "@/components/ComingSoon";
import DemoAvatar from "@/pages/DemoAvatar.tsx";
 
const CompanionContent = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showDemoAvatar, setShowDemoAvatar] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            fetchUserAvatars();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchUserAvatars = async () => {
        if (!user) return;

        try {
            const {data, error} = await supabase
                .from('minted_nfts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', {ascending: false});

            if (error) throw error;
            setAvatars(data || []);

            // Auto-select first avatar if available
            if (data && data.length > 0) {
                setSelectedAvatar(data[0]);
            }
        } catch (error) {
            console.error('Error fetching avatars:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        console.log("Message sent:", message);
        setMessage("");
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    const handleAvatarSelect = (avatar: any) => {
        setSelectedAvatar(avatar);
        setShowDemoAvatar(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header/>

            <main className="flex-grow flex flex-col">
                <section className="py-8 bg-primary/5">
                    <div className="container">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-3xl font-bold mb-2">
                                Your AI <span className="gradient-text">Companion</span>
                            </h1>
                            <p className="text-muted-foreground">
                                Chat with your emotionally intelligent avatar and earn $C8R tokens through journaling.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex-grow py-8">
                    <div className="container h-full">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
                            <div className="lg:col-span-1">
                                <div
                                    className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 rounded-lg p-4 h-full">
                                    <h3 className="font-medium mb-4">Your Avatars</h3>
                                    <Button className="my-2 w-full" onClick={() => setShowDemoAvatar(true)}>Demo
                                        Avatar</Button>
                                    {!user ? (
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Sign in to view your avatars.
                                            </p>
                                            <Button onClick={() => navigate("/auth")} size="sm">
                                                Sign In
                                            </Button>
                                        </div>
                                    ) : loading ? (
                                        <p className="text-sm text-muted-foreground">Loading avatars...</p>
                                    ) : avatars.length > 0 ? (
                                        <div className="space-y-3">
                                            {avatars.map((avatar) => (
                                                <div
                                                    key={avatar.id}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                                                        selectedAvatar?.id === avatar.id
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border'
                                                    }`}
                                                    onClick={() => handleAvatarSelect(avatar)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-rohum-blue/10 to-rohum-pink/10 flex-shrink-0">
                                                            {avatar.image_url ? (
                                                                <img
                                                                    src={avatar.image_url}
                                                                    alt={avatar.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="w-full h-full flex items-center justify-center">
                                                                    <Image className="w-6 h-6 text-muted-foreground"/>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{avatar.name}</p>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {avatar.role_type}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground mb-4">
                                                You don't have any avatars yet.
                                            </p>
                                            <Button onClick={() => navigate("/mint")} size="sm">
                                                Mint Avatar
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/*Demo Avatar Component*/}
                            {showDemoAvatar ? (
                                    <div className="lg:col-span-3 flex flex-col h-[500px]">
                                <DemoAvatar/>
                                    </div>
                            ) : <div className="lg:col-span-3 flex flex-col h-full">
                                <div
                                    className="bg-card/50 backdrop-filter backdrop-blur-sm border border-border/50 rounded-lg p-4 flex-grow mb-4 min-h-[400px]">
                                    {selectedAvatar ? (
                                        <>
                                            <div className="flex items-center mb-4 pb-4 border-b">
                                                <div
                                                    className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-rohum-blue to-rohum-pink flex-shrink-0">
                                                    {selectedAvatar.image_url ? (
                                                        <img
                                                            src={selectedAvatar.image_url}
                                                            alt={selectedAvatar.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full bg-gradient-to-br from-rohum-blue to-rohum-pink"></div>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="font-medium">{selectedAvatar.name}</h4>
                                                    <p className="text-xs text-muted-foreground">Online
                                                        • {selectedAvatar.role_type}</p>
                                                </div>
                                            </div>

                                            <div className="h-full flex items-center justify-center">
                                                {selectedAvatar.image_url ? (
                                                    <div className="max-w-md mx-auto">
                                                        <img
                                                            src={selectedAvatar.image_url}
                                                            alt={selectedAvatar.name}
                                                            className="w-full rounded-lg shadow-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-center max-w-md">
                                                        <div
                                                            className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-rohum-blue to-rohum-pink"></div>
                                                        <p className="text-muted-foreground mb-4">
                                                            Your avatar {selectedAvatar.name} is ready to chat!
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center max-w-md">
                                                <p className="text-muted-foreground mb-4">
                                                    {!user
                                                        ? "Sign in and mint an avatar to start chatting with your AI companion."
                                                        : avatars.length === 0
                                                            ? "Mint your first avatar to start chatting with your AI companion."
                                                            : "Select an avatar from the sidebar to start chatting."
                                                    }
                                                </p>
                                                {!user ? (
                                                    <Button onClick={() => navigate("/auth")}>Sign In</Button>
                                                ) : avatars.length === 0 ? (
                                                    <Button onClick={() => navigate("/mint")}>Mint Avatar</Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={toggleRecording}
                                        className={isRecording ? "bg-rohum-pink/10 text-rohum-pink" : ""}
                                        disabled={!selectedAvatar}
                                    >
                                        {isRecording ? <MicOff className="h-5 w-5"/> : <Mic className="h-5 w-5"/>}
                                    </Button>
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={selectedAvatar ? "Type your message..." : "Select an avatar to start chatting..."}
                                        className="flex-grow"
                                        disabled={!selectedAvatar}
                                    />
                                    <Button type="submit" size="icon" disabled={!selectedAvatar}>
                                        <Send className="h-5 w-5"/>
                                    </Button>
                                </form>
                            </div>}
                        </div>
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    );
};

const Companion = () => {
    return (
        <ComingSoon>
            <CompanionContent/>
        </ComingSoon>
    );
};

export default Companion;
