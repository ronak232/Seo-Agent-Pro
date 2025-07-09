/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // or 'app' folder
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // (optional if using Chakra theme)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
