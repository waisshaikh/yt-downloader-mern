import { motion } from "framer-motion";
import { Eye, User } from "lucide-react";
import { formatDuration, formatNumber } from "@/lib/utils";
import { FormatSelector } from "./FormatSelector";
import { useDownload } from "@/hooks/use-youtube";


interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string | null;
  duration: number | null;
  uploader: string | null;
  viewCount: number | null;
  formats: any[];
}

interface VideoResultProps {
  url: string;
  info: VideoInfo;
}

export function VideoResult({ url, info }: VideoResultProps) {
  const { download, isDownloading } = useDownload();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="rounded-3xl p-6 lg:p-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden bg-[#121212]/80 border border-white/10"
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* LEFT SIDE */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="relative group rounded-2xl overflow-hidden shadow-xl aspect-video bg-black/40">
          {info.thumbnail ? (
            <img
              src={info.thumbnail}
              alt={info.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/30">
              No Thumbnail
            </div>
          )}

          {info.duration && (
            <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs text-white">
              {formatDuration(info.duration)}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3">{info.title}</h2>

          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            {info.uploader && (
              <div className="flex items-center gap-1">
                <User size={14} />
                {info.uploader}
              </div>
            )}

            {info.viewCount && (
              <div className="flex items-center gap-1">
                <Eye size={14} />
                {formatNumber(info.viewCount)} views
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:col-span-7 flex flex-col border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
        <h3 className="text-lg font-semibold mb-4">
          Select Quality & Format
        </h3>

        <FormatSelector
          formats={info.formats}
          onDownload={(formatId: string) => download(url, formatId)}
          isDownloading={isDownloading}
        />
      </div>

      {/* DOWNLOAD LOADER */}
      {isDownloading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
          Downloading...
        </div>
      )}
    </motion.div>
  );
}