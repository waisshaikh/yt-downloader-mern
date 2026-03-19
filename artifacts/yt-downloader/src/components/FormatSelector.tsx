import { useState } from "react";
import { formatBytes } from "@/lib/utils";
import type { VideoFormat } from "@workspace/api-client-react";
import { Film, Music, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface FormatSelectorProps {
  formats: VideoFormat[];
  onDownload: (formatId: string) => void;
  isDownloading: boolean;
}

export function FormatSelector({ formats, onDownload, isDownloading }: FormatSelectorProps) {
  // Sort and filter formats
  const videoFormats = formats
    .filter((f) => f.hasVideo)
    .sort((a, b) => {
      // Sort by resolution roughly
      const resA = parseInt(a.resolution?.replace(/\D/g, "") || "0");
      const resB = parseInt(b.resolution?.replace(/\D/g, "") || "0");
      return resB - resA;
    });

  const audioFormats = formats
    .filter((f) => !f.hasVideo && f.hasAudio)
    .sort((a, b) => {
      // Sort by bitrate/filesize roughly
      return (b.filesize || 0) - (a.filesize || 0);
    });

  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");
  const [selectedFormat, setSelectedFormat] = useState<string | null>(
    videoFormats.length > 0 ? videoFormats[0].formatId : audioFormats[0]?.formatId || null
  );

  const activeList = activeTab === "video" ? videoFormats : audioFormats;

  return (
    <div className="flex flex-col h-full">
      <div className="flex bg-black/20 p-1 rounded-xl mb-4 w-full max-w-sm">
        <button
          onClick={() => {
            setActiveTab("video");
            if (videoFormats.length > 0 && (!selectedFormat || !videoFormats.find(f => f.formatId === selectedFormat))) {
              setSelectedFormat(videoFormats[0].formatId);
            }
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === "video" 
              ? "bg-white/10 text-white shadow-sm" 
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          )}
        >
          <Film className="w-4 h-4" />
          Video + Audio
        </button>
        <button
          onClick={() => {
            setActiveTab("audio");
            if (audioFormats.length > 0 && (!selectedFormat || !audioFormats.find(f => f.formatId === selectedFormat))) {
              setSelectedFormat(audioFormats[0].formatId);
            }
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
            activeTab === "audio" 
              ? "bg-white/10 text-white shadow-sm" 
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          )}
        >
          <Music className="w-4 h-4" />
          Audio Only
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2 mb-6 min-h-[200px] max-h-[300px]">
        {activeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>No formats available for this selection.</p>
          </div>
        ) : (
          activeList.map((format) => {
            const isSelected = selectedFormat === format.formatId;
            const label = format.hasVideo 
              ? (format.resolution || format.quality || "Unknown")
              : (format.quality || "Audio");
              
            return (
              <button
                key={format.formatId}
                onClick={() => setSelectedFormat(format.formatId)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left",
                  isSelected 
                    ? "bg-primary/10 border-primary shadow-md shadow-primary/5" 
                    : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center border-2",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                  )}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <div className={cn("font-medium", isSelected ? "text-white" : "text-muted-foreground")}>
                      {label} <span className="uppercase text-xs opacity-70 ml-1">{format.ext}</span>
                    </div>
                    {(format.vcodec && format.hasVideo) && (
                      <div className="text-xs text-muted-foreground mt-0.5 opacity-60">
                        {format.vcodec} {format.fps ? `• ${format.fps}fps` : ''}
                      </div>
                    )}
                  </div>
                </div>
                <div className={cn("font-mono text-sm", isSelected ? "text-primary-foreground" : "text-muted-foreground")}>
                  {formatBytes(format.filesize)}
                </div>
              </button>
            );
          })
        )}
      </div>

      <Button 
        size="lg" 
        className="w-full h-14 text-lg font-bold shadow-primary/30"
        disabled={!selectedFormat || isDownloading}
        isLoading={isDownloading}
        onClick={() => selectedFormat && onDownload(selectedFormat)}
      >
        {!isDownloading && (
          <>
            Download Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </>
        )}
      </Button>
    </div>
  );
}
