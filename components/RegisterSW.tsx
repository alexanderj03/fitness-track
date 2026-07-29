"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {});

    // Hand the worker the list of build chunks this page actually used, so the
    // next cold launch hydrates from cache instead of the network.
    const reportAssets = () => {
      navigator.serviceWorker.ready
        .then((registration) => {
          const worker = navigator.serviceWorker.controller ?? registration.active;
          if (!worker) return;

          const urls = performance
            .getEntriesByType("resource")
            .map((entry) => entry.name)
            .filter((name) => name.startsWith(`${location.origin}/_next/static/`));

          if (urls.length > 0) worker.postMessage({ type: "cache-assets", urls });
        })
        .catch(() => {});
    };

    if (document.readyState === "complete") {
      reportAssets();
    } else {
      window.addEventListener("load", reportAssets, { once: true });
      return () => window.removeEventListener("load", reportAssets);
    }
  }, []);

  return null;
}
