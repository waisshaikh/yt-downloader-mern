import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";


async function getVideoInfo(url: string) {
  const res = await fetch(
    `http://localhost:5000/api/youtube/info?url=${encodeURIComponent(url)}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch video info");
  }

  return res.json();
}

export interface HistoryItem {
  url: string;
  title: string;
  thumbnail: string | null;
  timestamp: number;
}

const HISTORY_KEY = "yt_dlp_history";

// ================= HISTORY =================
export function useYoutubeHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }, []);

  const addToHistory = (info: any, url: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.url !== url);

      const newItem: HistoryItem = {
        url,
        title: info.title,
        thumbnail: info.thumbnail,
        timestamp: Date.now(),
      };

      const updated = [newItem, ...filtered].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return { history, addToHistory, clearHistory };
}

// ================= ANALYZE =================
export function useAnalyzeVideo() {
  const { addToHistory } = useYoutubeHistory();

  return useMutation({
    mutationFn: async (url: string) => {
      if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
        throw new Error("Enter valid YouTube URL");
      }

      return getVideoInfo(url);
    },

    onSuccess: (data, url) => {
      addToHistory(data, url);
    },
  });
}

// ================= DOWNLOAD =================
export function useDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = (url: string, formatId: string) => {
    setIsDownloading(true);

    const dlUrl = `http://localhost:5000/api/youtube/download?url=${encodeURIComponent(
      url
    )}&formatId=${encodeURIComponent(formatId)}`;

    const a = document.createElement("a");
    a.href = dlUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => setIsDownloading(false), 2000);
  };

  return { download, isDownloading };
}