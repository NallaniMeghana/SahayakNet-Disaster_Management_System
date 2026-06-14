import { ThemeConfig } from "@/types/profileThemes";
import { ReactNode } from "react";

interface InstagramStoryTemplateProps {
  theme: ThemeConfig;
  children: ReactNode;
}

const InstagramStoryTemplate = ({ theme, children }: InstagramStoryTemplateProps) => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Background with gradient */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(180deg, #0A0A0A 0%, #004d40 100%)`
        }}
      />
      
      {/* Themed gradient overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background: theme.gradient
        }}
      />
      
      {/* Topographic pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.03) 10px,
            rgba(255,255,255,0.03) 20px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.03) 10px,
            rgba(255,255,255,0.03) 20px
          )`
        }}
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              background: theme.particleColor,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
              opacity: 0.4
            }}
          />
        ))}
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full blur-3xl z-0 opacity-30"
        style={{
          background: theme.glowColor
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default InstagramStoryTemplate;
