import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

export default function Logo({ size = "md", light = false }: LogoProps) {
  const iconDimensions = size === "sm" ? 32 : size === "lg" ? 54 : 42;
  const fontSize = size === "sm" ? "1rem" : size === "lg" ? "1.6rem" : "1.25rem";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
      {/* Monogram Dual S Scissors Icon */}
      <svg
        width={iconDimensions}
        height={iconDimensions}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: "drop-shadow(0px 2px 4px rgba(193,157,96,0.3))" }}
      >
        <rect width="100" height="100" rx="20" fill="#c19d60" />
        
        {/* Top 'S' loop */}
        <path
          d="M48 20 C36 20 34 32 46 36 C58 40 56 52 44 52 C36 52 34 46 34 44"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right interlocking 'S' loop */}
        <path
          d="M54 26 C66 26 68 36 58 42 C48 48 52 60 64 58"
          stroke="#121315"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Scissors Blade Lines intersecting */}
        <path d="M42 46 L30 80" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <path d="M58 46 L70 80" stroke="#121315" strokeWidth="5" strokeLinecap="round" />
        
        {/* Scissor Finger Loops */}
        <circle cx="30" cy="80" r="6" stroke="#FFFFFF" strokeWidth="4" fill="none" />
        <circle cx="70" cy="80" r="6" stroke="#121315" strokeWidth="4" fill="none" />

        {/* Center Pivot Star */}
        <polygon points="50,42 52,47 57,47 53,50 55,55 50,52 45,55 47,50 43,47 48,47" fill="#FFFFFF" />
      </svg>

      {/* Brand Text */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize,
            color: light ? "#FFFFFF" : "#121315",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          SS Hair Studio
        </span>
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: size === "sm" ? "0.6rem" : "0.7rem",
            color: "#c19d60",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Luxury Unisex Salon
        </span>
      </div>
    </div>
  );
}
