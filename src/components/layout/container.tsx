import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = '',
}: ContainerProps) {
  return (
    <div className={`w-full px-4 py-3 md:px-30 md:py-4 ${className}`}>
      {children}
    </div>
  );
}
