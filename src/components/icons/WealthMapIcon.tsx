
import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export function WealthMapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={cn("h-8 w-8 text-primary", props.className)}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="7.5" fill="white" strokeWidth="0" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18V6" />
    </svg>
  );
}
