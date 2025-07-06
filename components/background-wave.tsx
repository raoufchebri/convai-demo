"use client";

interface BackgroundWaveProps {
  theme?: 'gray' | 'pink' | 'green' | 'blue' | 'purple';
}

export const BackgroundWave = ({ theme = 'gray' }: BackgroundWaveProps) => {
  const gradients = {
    gray: {
      id: "waveGradientGray",
      colors: ["#f3f4f6", "#e5e7eb", "#d1d5db"]
    },
    pink: {
      id: "waveGradientPink", 
      colors: ["#fce7f3", "#fbcfe8", "#f9a8d4"]
    },
    green: {
      id: "waveGradientGreen",
      colors: ["#dcfce7", "#bbf7d0", "#86efac"]
    },
    blue: {
      id: "waveGradientBlue",
      colors: ["#dbeafe", "#bfdbfe", "#93c5fd"]
    },
    purple: {
      id: "waveGradientPurple",
      colors: ["#f3e8ff", "#e9d5ff", "#c084fc"]
    }
  };

  const currentGradient = gradients[theme];

  return (
    <div className="fixed bottom-0 left-0 w-full h-96 z-[-1] hidden md:block opacity-75 overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={currentGradient.id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentGradient.colors[0]} />
            <stop offset="50%" stopColor={currentGradient.colors[1]} />
            <stop offset="100%" stopColor={currentGradient.colors[2]} />
          </linearGradient>
        </defs>
        
        {/* First wave layer */}
        <path
          d="M0,250 Q300,200 600,250 T1200,250 L1200,400 L0,400 Z"
          fill={`url(#${currentGradient.id})`}
          opacity="0.6"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,250 Q300,200 600,250 T1200,250 L1200,400 L0,400 Z;
              M0,250 Q300,300 600,250 T1200,250 L1200,400 L0,400 Z;
              M0,250 Q300,200 600,250 T1200,250 L1200,400 L0,400 Z
            "
          />
        </path>
        
        {/* Second wave layer */}
        <path
          d="M0,260 Q400,220 800,260 T1200,260 L1200,400 L0,400 Z"
          fill={`url(#${currentGradient.id})`}
          opacity="0.4"
        >
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M0,260 Q400,220 800,260 T1200,260 L1200,400 L0,400 Z;
              M0,260 Q400,300 800,260 T1200,260 L1200,400 L0,400 Z;
              M0,260 Q400,220 800,260 T1200,260 L1200,400 L0,400 Z
            "
          />
        </path>
        
        {/* Third wave layer */}
        <path
          d="M0,270 Q500,240 1000,270 T1200,270 L1200,400 L0,400 Z"
          fill={`url(#${currentGradient.id})`}
          opacity="0.2"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,270 Q500,240 1000,270 T1200,270 L1200,400 L0,400 Z;
              M0,270 Q500,320 1000,270 T1200,270 L1200,400 L0,400 Z;
              M0,270 Q500,240 1000,270 T1200,270 L1200,400 L0,400 Z
            "
          />
        </path>
      </svg>
    </div>
  );
};
