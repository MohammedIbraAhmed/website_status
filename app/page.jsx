"use client";

import React, { useState, useEffect } from "react"; // Keep useEffect for other potential uses if needed
import { ThemeSwitcher } from "./components/ThemeSwitcher"; // Import the new component

// Placeholder function for ad refresh logic
const refreshAds = () => {
  console.log("Refreshing ads...");
  // In a real implementation, you would trigger your ad library's refresh mechanism here.
  // For example, if using Google AdSense, you might need to manage ad slots dynamically.
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  // Removed theme state and useEffects - will be handled by next-themes and ThemeSwitcher component

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!url || isLoading) return;

    setIsLoading(true);
    setResult(null);

    let fullUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      fullUrl = `https://${url}`;
    }

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: fullUrl }),
      });
      const data = await response.json();
      if (!response.ok) {
        setResult({
          status: "error",
          screenshot: null,
          message: data.message || `API Error: ${response.status}`,
        });
      } else {
        if (data.screenshot) {
          data.screenshot = `data:image/png;base64,${data.screenshot}`;
        }
        setResult(data);
      }
    } catch (error) {
      console.error("Failed to fetch API:", error);
      setResult({
        status: "error",
        screenshot: null,
        message: "Failed to connect to the checker service.",
      });
    } finally {
      setIsLoading(false);
      refreshAds(); // Refresh ads after getting result
    }
  };

  // Handle reset
  const handleReset = () => {
    setUrl("");
    setResult(null);
    setIsLoading(false);
    refreshAds(); // Refresh ads on reset
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex flex-col items-center p-4 pt-8 transition-colors duration-300">
      {/* Use the ThemeSwitcher component */}
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      {/* --- Header Ad Placeholder --- */}
      <div className="w-full max-w-5xl h-20 bg-gray-200/50 dark:bg-gray-700/30 mb-8 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm rounded">
        [Header Ad Area]
      </div>

      {/* Layout with Sidebars */}
      <div className="flex w-full max-w-7xl justify-center gap-8 px-4">
        {/* --- Left Sidebar Ad Placeholder --- */}
        {/* Use hidden by default, lg:flex overrides display on large screens */}
        <aside className="hidden w-40 h-[600px] bg-gray-200/50 dark:bg-gray-700/30 lg:flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm rounded sticky top-8">
          [Left Ad Area]
        </aside>

        {/* Main content card */}
        {/* Darker background for dark mode */}
        <main className="flex-grow max-w-3xl bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg dark:shadow-indigo-900/30 mb-8 transition-colors duration-300">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
            Website Status Checker
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 mb-4" // Reduced bottom margin
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              required
              // Adjusted dark mode input styles: darker bg, lighter placeholder
              className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading || !url}
            >
              {isLoading ? "Checking..." : "Check Status"}
            </button>
          </form>

          {/* Reset Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={handleReset}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || (!url && !result)}
            >
              Reset / New URL
            </button>
          </div>

          {/* --- Results Area --- */}
          {/* Darker results area background */}
          <div className="mt-6 min-h-[250px] border border-gray-200 dark:border-gray-700 p-5 rounded-lg bg-gray-50/80 dark:bg-gray-800/60 transition-colors duration-300">
            {isLoading && (
              <div className="flex justify-center items-center h-full pt-10">
                <p className="text-indigo-600 dark:text-indigo-400 animate-pulse">
                  Loading...
                </p>
              </div>
            )}

            {!isLoading && result && (
              <div>
                <p
                  className={`text-lg font-semibold mb-2 ${
                    result.status === "online"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  Status:{" "}
                  {result.status.charAt(0).toUpperCase() +
                    result.status.slice(1)}
                  {result.message && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {" "}
                      ({result.message})
                    </span>
                  )}
                </p>

                {result.screenshot && (
                  <div className="mb-4">
                    <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                      Screenshot:
                    </h3>
                    <img
                      src={result.screenshot}
                      alt="Website screenshot"
                      className="border border-gray-300 dark:border-gray-600 rounded shadow-sm w-full"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Status 'Online' means a page loaded. Please check the
                      screenshot to confirm it's the expected website and not a
                      parking/renewal page.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!isLoading && !result && (
              <p className="text-gray-500 dark:text-gray-400 text-center pt-10">
                Enter a URL and click 'Check Status' to see the results.
              </p>
            )}
          </div>
        </main>

        {/* --- Right Sidebar Ad Placeholder --- */}
        {/* Use hidden by default, lg:flex overrides display on large screens */}
        <aside className="hidden w-40 h-[600px] bg-gray-200/50 dark:bg-gray-700/30 lg:flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm rounded sticky top-8">
          [Right Ad Area]
        </aside>
      </div>

      {/* --- Footer Ad Placeholder --- */}
      <div className="w-full max-w-5xl h-20 bg-gray-200/50 dark:bg-gray-700/30 mt-8 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm rounded">
        [Footer Ad Area]
      </div>
    </div>
  );
}
