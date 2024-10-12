'use client';
import { useEffect, useState } from "react";

const DownloadPortfolio = () => {
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    if (!hasDownloaded) {
      // Trigger the download
      const downloadPortfolio = async () => {
        const response = await fetch("/api/downloadcv");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "sambhav_surana_portfolio.pdf";
        link.click();
        // Redirect to homepage after download
        window.location.href = "/";
      };

      downloadPortfolio();
      setHasDownloaded(true); // Prevent further downloads in Strict Mode
    }
  }, [hasDownloaded]);

  return (
    <div>
      <h1>Downloading Portfolio...</h1>
    </div>
  );
};

export default DownloadPortfolio;

