import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { Paragraph } from "@/components/UI/atoms";

export interface SliderProps extends SliderPrimitive.SliderProps {
  label: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & SliderProps
>(({ className, value, label, ...props }, ref) => {
  return (
    <>
      <SliderPrimitive.Root
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        value={value}
        ref={ref}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      {value ? (
        <Paragraph className="mt-2">
          {label}: {value}
        </Paragraph>
      ) : null}
    </>
  );
});
Slider.displayName = "Slider";

export { Slider };
