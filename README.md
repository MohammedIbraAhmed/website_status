# Is It Working?

A simple Next.js application that checks if websites are online and captures screenshots.

## Features

- Check if a website is online
- Capture screenshots of websites
- Light/Dark theme toggle
- Responsive design with ad placeholders

## Technologies Used

- Next.js
- Tailwind CSS
- Puppeteer (for screenshots)
- next-themes (for theme switching)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/MohammedIbraAhmed/website_status.git
   cd website_status
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Enter a website URL in the input field
2. Click "Check Status" to check if the website is online
3. View the status and screenshot (if available)
4. Use the theme toggle button in the top-right corner to switch between light and dark mode

## Notes

- The application automatically adds "https://" to URLs if not provided
- Screenshots are captured using Puppeteer
- The application includes placeholders for ad areas
