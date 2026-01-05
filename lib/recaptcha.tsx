"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface ReCaptchaContextType {
  executeRecaptcha: ((action: string) => Promise<string>) | null;
}

const ReCaptchaContext = createContext<ReCaptchaContextType>({
  executeRecaptcha: null,
});

export const useReCaptcha = () => {
  const context = useContext(ReCaptchaContext);
  if (!context) {
    throw new Error("useReCaptcha must be used within ReCaptchaProvider");
  }
  return context;
};

interface ReCaptchaProviderProps {
  siteKey: string;
  children: React.ReactNode;
}

export const ReCaptchaProvider: React.FC<ReCaptchaProviderProps> = ({ siteKey, children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!siteKey) {
      console.error("reCAPTCHA site key is missing");
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="recaptcha"]`);
    if (existingScript) {
      setIsReady(true);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsReady(true);
    };

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector(`script[src*="recaptcha"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [siteKey]);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string> => {
      if (!isReady) {
        throw new Error("reCAPTCHA is not ready");
      }

      return new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !window.grecaptcha) {
          reject(new Error("reCAPTCHA not loaded"));
          return;
        }

        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action }).then(resolve).catch(reject);
        });
      });
    },
    [isReady, siteKey]
  );

  return <ReCaptchaContext.Provider value={{ executeRecaptcha: isReady ? executeRecaptcha : null }}>{children}</ReCaptchaContext.Provider>;
};

// Declare grecaptcha on window object
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
