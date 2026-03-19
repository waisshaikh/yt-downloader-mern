import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadCloud, AlertCircle } from "lucide-react";
import { UrlInput } from "../components/UrlInput";
import { VideoResult } from "../components/VideoResult";
import { HistoryList } from "../components/HistoryList";
import { useAnalyzeVideo, useYoutubeHistory } from "../hooks/use-youtube";

export default function Home() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const analyzeMutation = useAnalyzeVideo();
  const { history, clearHistory } = useYoutubeHistory();

  const handleAnalyze = (url: string) => {
    setCurrentUrl(url);
    analyzeMutation.mutate(url);
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden pb-24 bg-[#0A0A0A] text-white transition-all duration-300">

      {/* Background Glow */}
      <div
        className="fixed inset-0 z-[-1] opacity-30 bg-cover bg-center pointer-events-none blur-3xl"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(0,255,247,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,198,255,0.15), transparent 40%)`
        }}
      />

      {/*  Navbar */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-gray-800 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <DownloadCloud className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-xl font-bold text-white">
            Downloader<span className="text-cyan-400 font-black">X</span>
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">

        {/* 🚀 Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Download High Quality <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Video & Audio
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 mb-12"
          >
            Paste a link from YouTube to instantly analyze and download in up to 4K resolution or extract crystal clear MP3 audio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <UrlInput
              onAnalyze={handleAnalyze}
              isAnalyzing={analyzeMutation.isPending}
            />
          </motion.div>
        </div>

        {/*  Error State */}
        <AnimatePresence mode="wait">
          {analyzeMutation.isError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 backdrop-blur-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>
                  {analyzeMutation.error?.message ||
                    "Failed to analyze the video. Please check the URL and try again."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/*  Result */}
        <AnimatePresence mode="wait">
          {analyzeMutation.isSuccess &&
            analyzeMutation.data &&
            currentUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VideoResult
                  key={analyzeMutation.data.id}
                  url={currentUrl}
                  info={analyzeMutation.data}
                />
              </motion.div>
            )}
        </AnimatePresence>

        {/*  History */}
        <div className="mt-16">
          <HistoryList
            history={history}
            onClear={clearHistory}
            onSelect={(url) => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              handleAnalyze(url);
            }}
          />
        </div>

      </main>
    </div>
  );
}