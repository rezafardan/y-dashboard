import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            // Typographic Hierarchy
            h1: {
              fontSize: "2.25rem", // 36px
              fontWeight: "700",
              marginBottom: "1rem",
              color: "#1a202c", // Dark headline color
            },
            h2: {
              fontSize: "1.75rem", // 28px
              fontWeight: "600",
              marginBottom: "0.75rem",
              color: "#2d3748", // Slightly lighter dark color
            },
            h3: {
              fontSize: "1.5rem", // 24px
              fontWeight: "600",
              marginBottom: "0.5rem",
              color: "#4a5568", // Medium dark color
            },
            p: {
              fontSize: "1rem", // 16px
              lineHeight: "1.6", // Optimal readability
              marginBottom: "1rem",
              color: "#2d3748", // Comfortable reading color
            },

            // List Styling
            "ul, ol": {
              paddingLeft: "1.5rem",
              marginBottom: "1rem",
              lineHeight: "1.6",
            },
            li: {
              marginBottom: "0.5rem",
            },

            // Link Styling
            a: {
              color: "#3182ce", // Professional blue
              textDecoration: "underline",
              fontWeight: "500",
              "&:hover": {
                color: "#2c5282",
              },
            },

            // Blockquote Styling
            blockquote: {
              borderLeftColor: "#4a5568",
              fontStyle: "italic",
              paddingLeft: "1rem",
              marginLeft: "0",
              borderLeftWidth: "4px",
              quotes: "none",
              color: "#4a5568",
            },

            // Code Styling
            code: {
              backgroundColor: "#f7fafc",
              padding: "0.2rem 0.4rem",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              color: "#d53f8c",
            },

            // Horizontal Rule
            hr: {
              borderColor: "#e2e8f0",
              marginTop: "2rem",
              marginBottom: "2rem",
            },
          },
        },
        // Variasi untuk dark mode
        invert: {
          css: {
            color: "#e2e8f0",
            "h1, h2, h3": {
              color: "#ffffff",
            },
            p: {
              color: "#cbd5e0",
            },
            a: {
              color: "#63b3ed",
              "&:hover": {
                color: "#4299e1",
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
