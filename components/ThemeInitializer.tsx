"use client";
import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return null;
}
