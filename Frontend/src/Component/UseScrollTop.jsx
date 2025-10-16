import { useEffect } from "react";

export default function useScrollToTop(dep) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dep]);
}
