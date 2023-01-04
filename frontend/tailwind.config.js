module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#51b080",
      },
      keyframes: {
        appearing: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      },
      animation: {
        appearing: "appearing 1s linear 1",
      },
    },
  },
  plugins: [],
};
