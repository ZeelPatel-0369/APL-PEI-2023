import * as React from "react";
import { Paragraph } from "@/components/UI/atoms";

export interface ErrorMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ErrorMessage = React.forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ children, ...props }, ref) => {
    return (
      <div className="mt-5" ref={ref} {...props}>
        <Paragraph className="text-destructive font-bold" size="lg">
          ERROR
        </Paragraph>
        <Paragraph className="text-destructive" size="lg">
          {children}
        </Paragraph>
      </div>
    );
  }
);
ErrorMessage.displayName = "ErrorMessage";

export { ErrorMessage };
