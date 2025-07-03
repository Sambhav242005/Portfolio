"use client";
import { useEffect, useRef } from "react";

const DownloadPortfolio = () => {
  const hasDownloaded = useRef(false);

  useEffect(() => {
    if (hasDownloaded.current) return;

    const downloadPortfolio = async () => {
      try {
        const response = await fetch("/api/downloadcv");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sambhav_surana_portfolio.pdf";
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      } finally {
        window.location.href = "/";
      }
    };

    downloadPortfolio();
    hasDownloaded.current = true;
  }, []);

  return (
    <div>
      <h1>Downloading Portfolio...</h1>
    </div>
  );
};

export default DownloadPortfolio;
