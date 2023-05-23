import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelPrimitive.LabelProps {
  required?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & LabelProps
>(({ className, required, children, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      {required ? <span className="text-destructive ml-1">*</span> : null}
    </LabelPrimitive.Root>
  );
});
Label.displayName = "Label";

export { Label };
