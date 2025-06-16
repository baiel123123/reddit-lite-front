import { useEffect, useRef } from "react";

export default function useObserver(callback, enabled = true) {
  const ref = useRef();

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { rootMargin: "100px" }
    );

    const current = ref.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [callback, enabled]);

  return ref;
}
