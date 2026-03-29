/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                apple: {
                    bg: '#000000',
                    card: '#1c1c1e',
                    border: '#38383a',
                    blue: '#0a84ff',
                    text: '#ffffff',
                    textMuted: '#98989d'
                }
            }
        },
    },
    plugins: [],
}
