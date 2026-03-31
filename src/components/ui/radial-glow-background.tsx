import { cn } from "@/lib/utils";

interface RadialGlowBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  glowPosition?: { x: string; y: string };
  opacity?: number;
}

export const RadialGlowBackground = ({
  children,
  className,
  glowColor = "rgba(132,204,22,0.4)", // Lime green default (teal: "rgba(94,234,212,0.4)")
  glowSize = 500,
  glowPosition = { x: "50%", y: "200px" },
  opacity = 0.4,
}: RadialGlowBackgroundProps) => {
  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      {/* Radial Glow Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle ${glowSize}px at ${glowPosition.x} ${glowPosition.y}, ${glowColor}, transparent)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};