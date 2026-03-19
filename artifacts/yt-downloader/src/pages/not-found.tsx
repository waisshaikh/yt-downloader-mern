import { Link } from "wouter";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-md w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link href="/" className="w-full">
          <Button size="lg" className="w-full">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Downloader
          </Button>
        </Link>
      </div>
    </div>
  );
}
