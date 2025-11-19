import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import heroSherwani from "@/assets/hero-sherwani.jpg";
export const VideoBanner = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // Auto-play on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play was prevented, keep muted and paused
        setIsPlaying(false);
      });
    }
  }, []);
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  return <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black">
      {/* Fallback Image (shown on mobile or if video fails) */}
      <div className="absolute inset-0 md:hidden">
        <img src={heroSherwani} alt="Craftsmanship showcase" className="w-full h-full object-cover" />
      </div>

      {/* Video (shown on desktop) */}
      

      {/* Gradient Overlay */}
      

      {/* Content */}
      

      {/* Video Controls (Desktop Only) */}
      <div className="hidden md:flex absolute bottom-6 right-6 gap-2">
        <Button variant="outline" size="icon" onClick={togglePlay} className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-full">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={toggleMute} className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-full">
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>;
};