import { useState } from "react";
import { Search, Link as LinkIcon, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

export function UrlInput({ onAnalyze, isAnalyzing }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto relative group"
    >
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-3xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-30",
        isFocused && "opacity-50 group-hover:opacity-50"
      )} />
      
      <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all focus-within:border-primary/50">
        <div className="pl-5 text-muted-foreground flex-shrink-0">
          <LinkIcon className="w-6 h-6" />
        </div>
        
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste YouTube link here..."
          className="w-full bg-transparent border-none outline-none px-4 py-5 text-lg text-foreground placeholder:text-muted-foreground/70"
          required
        />
        
        <div className="pr-3 flex-shrink-0">
          <Button 
            type="submit" 
            size="lg" 
            isLoading={isAnalyzing}
            className="rounded-xl px-6 gap-2"
          >
            {!isAnalyzing && (
              <>
                Analyze
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
