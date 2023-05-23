import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const paragraphVariants = cva("text-base", {
  variants: {
    variant: {
      default: "text-primary",
      muted: "text-primary/60",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg md:text-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <p
        className={cn(paragraphVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Paragraph.displayName = "Paragraph";

export { Paragraph };
