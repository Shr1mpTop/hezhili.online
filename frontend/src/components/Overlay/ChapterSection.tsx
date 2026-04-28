import { ReactNode } from "react";

interface Props {
  id: string;
  label?: string;
  className?: string;
  children: ReactNode;
}

export default function ChapterSection({
  id,
  label,
  className,
  children,
}: Props) {
  return (
    <section id={id} className={`chapter-section ${className || ""}`}>
      <div className="chapter-content">
        {label && (
          <div className="section-label animate-in">{label}</div>
        )}
        {children}
      </div>
    </section>
  );
}
