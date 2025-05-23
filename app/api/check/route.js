import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Basic URL validation
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

export async function POST(request) {
  let browser = null;
  try {
    const { url } = await request.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { status: "error", message: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // --- Puppeteer Launch ---
    // Use different configuration for development and production (Vercel)
    const isProduction = process.env.NODE_ENV === "production";

    const options = isProduction
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        }
      : {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          executablePath:
            process.env.CHROME_EXECUTABLE_PATH ||
            (process.platform === "win32"
              ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
              : "/usr/bin/google-chrome"),
        };

    browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 }); // Set a reasonable viewport

    let screenshot = null;
    let status = "offline"; // Default to offline
    let message = "Navigation failed";

    try {
      // Navigate to the page with a timeout
      const response = await page.goto(url, {
        waitUntil: "networkidle2", // Wait until network is relatively idle
        timeout: 20000, // 20 seconds timeout
      });

      if (response && response.ok()) {
        status = "online";
        message = "Website loaded successfully";
        screenshot = await page.screenshot({ encoding: "base64" });
      } else {
        // Handle non-ok responses (e.g., 404, 500)
        status = "error";
        message = `Website returned status: ${response?.status() || "unknown"}`;
      }
    } catch (error) {
      console.error(`Navigation error for ${url}:`, error);
      status = "offline"; // Treat navigation errors as offline
      message =
        error.message.length > 100
          ? error.message.substring(0, 100) + "..."
          : error.message;
      // More specific error checks could be added here (e.g., timeout, DNS error)
      if (error.name === "TimeoutError") {
        message = "Navigation timed out";
      }
    }

    return NextResponse.json({ status, screenshot, message });
  } catch (error) {
    console.error("API Error:", error);
    // General server error
    return NextResponse.json(
      { status: "error", message: "An internal server error occurred" },
      { status: 500 }
    );
  } finally {
    // Ensure browser is closed even if errors occur
    if (browser) {
      await browser.close();
    }
  }
}
