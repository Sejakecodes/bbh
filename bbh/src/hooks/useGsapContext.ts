import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapContext(
  fn: (self: gsap.Context, scope: Element | string) => void,
  deps: React.DependencyList = [],
) {
  const scopeRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context((self) => fn(self, scope), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
