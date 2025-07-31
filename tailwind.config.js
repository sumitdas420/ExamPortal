// tailwind.config.js
module.exports = {
  darkMode: "class", // crucial for shadcn/ui theme switching!
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}', // if any
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "muted-foreground": "hsl(var(--muted-foreground))"
        // feel free to add your own tokens here!
      },
      // Optionally, if you want shadcn/ui's radius scale for rounded corners:
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    // Add any other plugins for forms, typography, etc, if needed
  ],
}
