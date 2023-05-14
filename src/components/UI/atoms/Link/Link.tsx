import { cn } from "@/lib/utils";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
}

export default function Link({
  children,
  href,
  className,
  ...props
}: LinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "font-medium hover:text-foreground/70 hover:underline",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
