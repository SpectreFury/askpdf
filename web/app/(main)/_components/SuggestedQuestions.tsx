'use client';

import { ArrowRight } from "lucide-react";

type SuggestedQuestionsProps = {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
};

const SuggestedQuestions = ({
  questions,
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps) => {
  if (questions.length === 0) return null;

  return (
    <div className="shrink-0">
      <p className="mb-2 text-xs font-medium uppercase text-secondary">
        Suggested questions
      </p>

      <ul className="flex flex-col gap-2">
        {questions.map((question) => (
          <li key={question}>
            <button
              type="button"
              onClick={() => onSelect(question)}
              disabled={disabled}
              className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-left text-xs transition-colors hover:bg-secondary/10 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="truncate">{question}</span>
              <ArrowRight className="size-3.5 shrink-0 text-secondary" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedQuestions;
