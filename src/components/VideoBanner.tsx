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

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black">
      {/* Fallback Image (shown on mobile or if video fails) */}
      <div className="absolute inset-0 md:hidden">
        <img
          src={heroSherwani}
          alt="Craftsmanship showcase"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Video (shown on desktop) */}
      <div className="hidden md:block absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          poster={heroSherwani}
        >
          {/* Using a placeholder - in production, replace with actual video URL */}
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container px-4">
          <div className="max-w-2xl text-white">
            <div className="inline-block bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-1 mb-4">
              <span className="text-sm font-semibold text-accent-foreground">
                Handcrafted Excellence
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold mb-4 animate-in fade-in slide-in-from-left duration-700">
              The Art of
              <br />
              Traditional Craftsmanship
            </h2>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/90 animate-in fade-in slide-in-from-left duration-700 delay-150">
              Watch our master artisans create timeless pieces with decades of expertise,
              weaving tradition into every stitch and embroidery.
            </p>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-left duration-700 delay-300">
              <Link to="/custom-tailoring">
                <Button size="lg" variant="default">
                  Book Custom Tailoring
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Video Controls (Desktop Only) */}
      <div className="hidden md:flex absolute bottom-6 right-6 gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlay}
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-full"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-full"
        >
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
    </section>
  );
};
