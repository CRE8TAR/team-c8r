import { useEffect, useState } from "react";
import { useAvatar } from "@/hooks/useAvatar";

interface UIProps {
    hidden: boolean;
    gender: "female" | "male";
    setGender: React.Dispatch<React.SetStateAction<"female" | "male">>;
}

export const UI = ({ hidden, gender, setGender }: UIProps) => {
    const { loading, message, changeLanguage, changeTopic, readNews, stopNews } = useAvatar();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [topic, setTopic] = useState("");
    const [newsText, setNewsText] = useState("");
    const [newsTitle, setNewsTitle] = useState("");
    const [uiMode, setUiMode] = useState<"topic" | "readNews">("topic");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (hidden) {
            setSidebarOpen(false);
        }
    }, [hidden]);

    const toggleGender = () => {
        setGender(gender === "female" ? "male" : "female");
    };

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        await changeLanguage(newLanguage, gender);
    };

    const handleTopicChange = async () => {
        if (topic.trim()) {
            setIsTyping(true);
            try {
                await changeTopic(topic, 5, selectedLanguage, gender);
            } finally {
                setIsTyping(false);
            }
            setTopic("");
        }
    };

    const handleReadNews = async () => {
        if (newsText.trim()) {
            setIsTyping(true);
            try {
                await readNews(newsText, newsTitle, selectedLanguage, gender);
            } finally {
                setIsTyping(false);
            }
            setNewsText("");
            setNewsTitle("");
        }
    };

    const handleStopNews = () => {
        stopNews();
    };

    if (hidden) return null;

    return (
        <div className="absolute top-0 right-0 flex flex-col z-10 pointer-events-auto">
            {/* Floating Toggle Button */}
            <div className="flex justify-end p-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                        sidebarOpen ? "rotate-90" : ""
                    }`}
                    aria-label={sidebarOpen ? "Close controls" : "Open controls"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                    </svg>
                </button>
            </div>

            {/* Slide-out Control Panel */}
            <div
                className={`absolute top-0 right-0 h-[500px] w-80 bg-gray-800 shadow-2xl 
                transform transition-all duration-300 ease-in-out p-6 overflow-y-auto
                ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
                border-l border-gray-700 pointer-events-auto`}
            >
                <div className="flex flex-col gap-6 h-full">
                    {/* Panel Header */}
                    <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                        <h2 className="text-white text-xl font-bold">Avatar Controls</h2>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="Close panel"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6 flex-grow overflow-y-auto">
                        {/* Gender Toggle */}
                        <div className="space-y-2">
                            <label className="text-gray-300 text-sm font-medium">Avatar Gender</label>
                            <button
                                onClick={toggleGender}
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {gender === "female" ? "Switch to Male" : "Switch to Female"}
                            </button>
                        </div>

                        {/* Language Selector */}
                        <div className="space-y-2">
                            <label htmlFor="language" className="text-gray-300 text-sm font-medium">Language</label>
                            <select
                                id="language"
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="it">Italian</option>
                                <option value="hi">Hindi</option>
                                <option value="ja">Japanese</option>
                                <option value="zh">Chinese</option>
                                <option value="ar">Arabic</option>
                                <option value="ru">Russian</option>
                                <option value="pt">Portuguese</option>
                            </select>
                        </div>

                        {/* Mode Selector */}
                        <div className="space-y-2">
                            <label className="text-gray-300 text-sm font-medium">Mode</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setUiMode("topic")}
                                    disabled={loading}
                                    className={`py-2 px-3 rounded-lg transition-colors font-medium ${
                                        uiMode === "topic" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    Search Topic
                                </button>
                                <button
                                    onClick={() => setUiMode("readNews")}
                                    disabled={loading}
                                    className={`py-2 px-3 rounded-lg transition-colors font-medium ${
                                        uiMode === "readNews" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    Read News
                                </button>
                            </div>
                        </div>

                        {/* Content Input Area */}
                        {uiMode === "topic" ? (
                            <div className="space-y-2">
                                <label htmlFor="topic" className="text-gray-300 text-sm font-medium">Topic</label>
                                <textarea
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Enter a topic for the news"
                                    className="w-full text-white placeholder-gray-400 py-3 px-4 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    rows={3}
                                    disabled={loading}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleTopicChange();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleTopicChange}
                                    disabled={loading || !topic.trim()}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isTyping && uiMode === "topic" ? "Processing..." : "Change Topic"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label htmlFor="newsTitle" className="text-gray-300 text-sm font-medium">News Title (Optional)</label>
                                <input
                                    id="newsTitle"
                                    value={newsTitle}
                                    onChange={(e) => setNewsTitle(e.target.value)}
                                    placeholder="Enter a title for your news"
                                    className="w-full text-white placeholder-gray-400 py-3 px-4 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                />
                                <label htmlFor="newsText" className="text-gray-300 text-sm font-medium">News Content</label>
                                <textarea
                                    id="newsText"
                                    value={newsText}
                                    onChange={(e) => setNewsText(e.target.value)}
                                    placeholder="Paste the news content"
                                    className="w-full text-white placeholder-gray-400 py-3 px-4 rounded-lg bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    rows={5}
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleReadNews}
                                    disabled={loading || !newsText.trim()}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isTyping && uiMode === "readNews" ? "Processing..." : "Read News"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stop Button */}
                    <div className="pt-4 border-t border-gray-700 space-y-4">
                        <button
                            onClick={handleStopNews}
                            disabled={!message}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Stop Speaking
                        </button>

                        <div className="text-sm">
                            {loading ? (
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
                                    <span>Avatar is speaking...</span>
                                </div>
                            ) : message ? (
                                <div className="flex items-center gap-2 text-green-400">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>Ready to speak</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                    <span>Idle</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
