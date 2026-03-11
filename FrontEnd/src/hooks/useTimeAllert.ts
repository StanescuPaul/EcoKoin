import { useState, useEffect } from "react";

export const useTimedAllert = (displayTime: number = 2000) => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, displayTime);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, displayTime]);

  return [message, setMessage] as const; //folosesc as const pentru a stii exact care e forma a ce returnam , prima e variabila a doua functia de set
};
