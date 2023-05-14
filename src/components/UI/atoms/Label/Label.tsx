import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export interface LabelProps extends LabelPrimitive.LabelProps {
  required?: boolean;
}

export default function Label({
  className,
  required,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required ? <span className="text-destructive ml-1">*</span> : null}
    </LabelPrimitive.Root>
  );
}
