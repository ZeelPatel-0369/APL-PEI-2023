import { cn } from "@/lib/utils";

type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

export default function Header({ className, children, ...props }: HeaderProps) {
  return (
    <div className={cn("bg-primary", className)} {...props}>
      {children}
    </div>
  );
}
