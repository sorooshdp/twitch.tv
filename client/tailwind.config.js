/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#9146FF",
                secondary: "#F0F0FF",
                dark: "#071013",
                muted: "#808782",
                "muted-dark": "#717568",
            },
        },
    },
    plugins: [],
};
