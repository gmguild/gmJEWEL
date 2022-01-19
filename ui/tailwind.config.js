const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./ui/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        rune: "#483F34",
        'rune-edge': "#565141",
        'rune-edge-light': "#71695F",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
  variants: {
    aspectRatio: ['responsive', 'hover']
  }
}
