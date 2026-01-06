import clsx from "clsx";
import React from "react";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
} & React.ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;

export function Heading({ className, level = 1, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        // "text-lg font-semibold text-zinc-950 sm:text-2xl/8 dark:text-white",
        "text-lg font-semibold text-zinc-950 sm:text-xl dark:text-zinc-950",
      )}
    />
  );
}

export function Subheading({ className, level = 2, ...props }: HeadingProps) {
  const Element: `h${typeof level}` = `h${level}`;

  return (
    <Element
      {...props}
      className={clsx(
        className,
        "text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-zinc-950",
      )}
    />
  );
}
