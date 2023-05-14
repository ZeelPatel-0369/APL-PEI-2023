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

export default function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ParagraphProps) {
  return (
    <p
      className={cn(paragraphVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </p>
  );
}
