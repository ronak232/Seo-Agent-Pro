import { useEffect, useState } from "react";

interface WordByWordProps {
  reasoning: string;
  onFinished: () => void;
}

export function ThinkingPlaceholder({
  reasoning,
  onFinished,
}: WordByWordProps) {
  const [displayedText, setDisplayedText] = useState<string>("");

  useEffect(() => {
    const words = reasoning ? reasoning.split(" ") : [];
    let index = 0;

    if (words.length === 0) {
      onFinished?.();
      setDisplayedText("");
      return;
    }

    const interval = setInterval(() => {
      setDisplayedText((prev) =>
        prev ? prev + " " + words[index] : words[index]
      );
      index++;
      if (index >= words.length) {
        onFinished?.();
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [reasoning, onFinished]);

  return (
    <div className="typing-indicator">
      <div className="avatar">AI</div>
      <div className="typing-content">
        <div className="thinking-header">
          <span className="thinking-label font-semibold text-sm">
            🤔 Thinking...
          </span>
        </div>
        <div
          tabIndex={0}
          className="thinking-text-container collapse-open collapse bg-base-100 border-base-300 border"
        >
          <p className="text-white whitespace-pre-wrap collapse-content text-sm">
            {displayedText}
          </p>
        </div>
      </div>
    </div>
  );
}
