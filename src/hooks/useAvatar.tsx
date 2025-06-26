"use client";
import { createContext, useContext, useEffect, useState, useRef } from "react";

interface LipsyncData {
    visemes: Array<{ time: number; value: string }>; // Example structure
    duration: number; // Duration of the audio in seconds
}

interface Message {
    text: string;
    audio: string; // URL of the audio file
    lipsync?: LipsyncData;
    facialExpression?: string;
    animation?: string;
    language?: string;
    title?: string; // Optional title for the news
}

interface AvatarContextType {
    message: Message | null;
    onMessagePlayed: () => void;
    loading: boolean;
    intro: (gender?: "female" | "male", language?: string) => Promise<void>;
    changeLanguage: (
        newLanguage: string,
        gender: "female" | "male"
    ) => Promise<void>;
    changeTopic: (
        topic: string,
        limit: number,
        selectedLanguage: string,
        gender: "female" | "male"
    ) => Promise<void>;
    readNews: (
        newsText: string,
        title?: string,
        language?: string,
        gender?: "female" | "male"
    ) => Promise<void>;
    stopNews: () => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    currentNews: string | null;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

import { ReactNode } from "react";

export const AvatarProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playingRef = useRef<boolean>(false);

    const intro = async (gender = "female", language = "en") => {
        setLoading(true);
        try {
            const data = await fetch(`/api/news-anchor/intro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ gender, language }),
            });
            const resp = (await data.json()).messages;
            // Append the intro message to the queue
            setMessages((messages) => [...messages, ...resp]);
        } catch (error) {
            console.error("Error in intro:", error);
        } finally {
            setLoading(false);
        }
    };

    const changeLanguage = async (language = "en", gender = "female") => {
        setLoading(true);
        try {
            const data = await fetch(`/api/news-anchor/change-language`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ language, gender }),
            });
            const resp = (await data.json()).message;
            // Append the response to the messages queue
            setMessages((messages) => [...messages, resp]);
        } catch (error) {
            console.error("Error in changeLanguage:", error);
        } finally {
            setLoading(false);
        }
    };

    const changeTopic = async (
        topic = "technology",
        limit = 5,
        language = "en",
        gender = "female"
    ) => {
        setLoading(true);
        try {
            const data = await fetch(`/api/news-anchor/change-topic`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic, limit, language, gender }),
            });

            const resp = await data.json();
            // Merge the new topic message and the news items into the queue
            setMessages([resp.message, ...resp.newsItems]);
        } catch (error) {
            console.error("Error in changeTopic:", error);
        } finally {
            setLoading(false);
        }
    };

    // New function to read custom news text
    const readNews = async (
        newsText: string,
        title?: string,
        language = "en",
        gender = "female"
    ) => {
        setLoading(true);
        try {
            const data = await fetch(`/api/news-anchor/read-news`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ newsText, title, language, gender }),
            });

            const resp = await data.json();
            // Append the news message to the queue
            setMessages((messages) => [...messages, resp.message]);
            setCurrentNews(resp.message.text); // Set the current news text
        } catch (error) {
            console.error("Error in readNews:", error);
        } finally {
            setLoading(false);
        }
    };

    const onMessagePlayed = () => {
        setMessages((messages) => messages.slice(1)); // Remove the first message
        playingRef.current = false;
    };

    const stopNews = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        playingRef.current = false;
        setMessages([]); // Clear all messages
        setMessage(null);
    };

    useEffect(() => {
        if (messages.length > 0) {
            setMessage(messages[0]); // Set the first message in the queue
        } else {
            setMessage(null); // Clear the current message when the queue is empty
        }
    }, [messages]);

    useEffect(() => {
        // Cleanup function for previous audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
            return;
        }

        // Only create and play audio if there's a message with audio and not currently playing
        if (message?.audio && !playingRef.current) {
            playingRef.current = true;

            const audio = new Audio(message.audio); // Use the audio URL
            audioRef.current = audio;

            // Play the audio
            audio
                .play()
                .then(() => {
                    console.log("Audio started playing");
                })
                .catch((err) => {
                    console.error("Error playing audio:", err);
                    playingRef.current = false;
                    audioRef.current = null;
                });

            // Handle audio end event
            audio.onended = () => {
                playingRef.current = false; // Reset playing state
                audioRef.current = null;
                onMessagePlayed(); // Remove the played message from the queue
            };

            // Handle audio error event
            audio.onerror = () => {
                console.error("Error occurred during audio playback");
                playingRef.current = false; // Reset playing state
                audioRef.current = null;
                onMessagePlayed(); // Remove the played message from the queue
            };
        }

        // Cleanup function for when the component unmounts or the message changes
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [message]);

    return (
        <AvatarContext.Provider
            value={{
        intro,
            message,
            onMessagePlayed,
            loading,
            changeLanguage,
            changeTopic,
            readNews,
            stopNews,
            audioRef,
            currentNews,
    }}
>
    {children}
    </AvatarContext.Provider>
);
};

export const useAvatar = () => {
    const context = useContext(AvatarContext);
    if (!context) {
        throw new Error("useAvatar must be used within a AvatarProvider");
    }
    return context;
};
