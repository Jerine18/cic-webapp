"use client";

import { useEffect, useState } from "react";

interface TypewriterHeadingProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterType?: number;
  pauseAfterDelete?: number;
  className?: string;
}

export default function TypewriterHeading({
  phrases,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseAfterType = 1800,
  pauseAfterDelete = 400,
  className = "",
}: TypewriterHeadingProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting && displayText === currentPhrase) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseAfterType);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === "") {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, pauseAfterDelete);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(
      () => {
        setDisplayText((prev) =>
          isDeleting
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        );
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    phraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseAfterType,
    pauseAfterDelete,
  ]);

  return (
    <h1
      className={className}
      aria-live="polite"
      aria-label={phrases[phraseIndex]}
    >
      <span>{displayText}</span>
      <span
        className="inline-block w-[3px] ml-1 align-middle animate-pulse"
        style={{
          backgroundColor: "#FFD700",
          height: "0.9em",
        }}
        aria-hidden="true"
      />
    </h1>
  );
}
