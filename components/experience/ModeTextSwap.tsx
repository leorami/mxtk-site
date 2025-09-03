"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Intrinsic = keyof JSX.IntrinsicElements;

type ModeTextSwapProps<T extends Intrinsic = "span"> = {
  as?: T;
  content: React.ReactNode;
  className?: string;
  depKey?: string | number;
  outMs?: number;
  inMs?: number;
} & Omit<React.ComponentProps<T>, "children" | "className">;

export default function ModeTextSwap<T extends Intrinsic = "span">({
  as,
  content,
  className = "",
  depKey,
  outMs = 300,
  inMs = 400,
  ...rest
}: ModeTextSwapProps<T>) {
  const Tag = (as || "span") as any;
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [displayed, setDisplayed] = useState<React.ReactNode>(content);
  const prevKey = useRef(depKey ?? content);

  useEffect(() => {
    const nextKey = depKey ?? content;
    if (nextKey === prevKey.current) return;
    prevKey.current = nextKey;
    setPhase("out");
    const t = setTimeout(() => {
      setDisplayed(content);
      setPhase("in");
    }, outMs);
    return () => clearTimeout(t);
  }, [content, depKey, outMs]);

  const cls = useMemo(() => {
    const base = className;
    const anim = phase === "out" ? "copy-fade-out" : "copy-fade-in";
    return [base, anim].filter(Boolean).join(" ");
  }, [className, phase]);

  return (
    <Tag {...rest} className={cls}>
      {displayed}
    </Tag>
  );
}


