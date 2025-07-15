/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// bagian sini ad yg kurang tepat syntax ny
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./app//*.{js,ts,jsx,tsx,mdx}",
//     "./pages//*.{js,ts,jsx,tsx,mdx}",
//     "./components//*.{js,ts,jsx,tsx,mdx}",

//     // Or if using src directory:
//     "./src//*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         purple: {
//           600: "#6B46C1",
//           700: "#553C9A",
//           800: "#44337A",
//         },
//       },
//     },
//   },
//   plugins: [],
// };