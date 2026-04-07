import type { SVGProps } from "react";

/**
 * Wireframe shopping cart: trapezoid basket, inner grid, handle, base, wheels.
 * Matches storefront-style outline carts (rounded caps).
 */
export function CartOutlineIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <g
        stroke="currentColor"
        strokeWidth={1.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 4.75 9.25 L 2.25 5.5" />
        <path d="M 4.75 9.25 h 14.5 l -2 6.5 H 6.75 l -2 -6.5 z" />
        <path d="M 6.4 11.55 h 11.2 M 7.15 13.35 h 9.7" />
        <path d="M 9.9 9.6 v 5.85 M 14.1 9.6 v 5.85" />
        <path d="M 6 16.85 h 12" />
        <circle cx={9} cy={18.75} r={1.6} />
        <circle cx={15} cy={18.75} r={1.6} />
      </g>
    </svg>
  );
}
