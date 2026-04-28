import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function GlassCard({ children, className = "", onClick, href }: Props) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`glass-card ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <div className={`glass-card ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
