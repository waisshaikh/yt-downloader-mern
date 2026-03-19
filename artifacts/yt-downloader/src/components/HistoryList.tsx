import { formatDistanceToNow } from "date-fns";
import { Trash2, History as HistoryIcon, PlaySquare } from "lucide-react";
import { Button } from "./ui/button";
import type { HistoryItem } from "@/hooks/use-youtube";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryListProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (url: string) => void;
}

export function HistoryList({ history, onClear, onSelect }: HistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div className="mt-24 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xl font-bold font-display">
          <HistoryIcon className="w-6 h-6 text-primary" />
          Recent Downloads
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear History
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {history.map((item) => (
            <motion.div
              key={item.timestamp}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
              onClick={() => onSelect(item.url)}
            >
              <div className="w-24 h-16 rounded-lg overflow-hidden bg-black/50 flex-shrink-0 relative">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <PlaySquare className="w-6 h-6 m-auto mt-5 opacity-50" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlaySquare className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                <h4 className="font-medium text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
