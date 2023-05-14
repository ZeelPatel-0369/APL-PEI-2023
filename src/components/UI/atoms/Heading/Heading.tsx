import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const commonClasses = "font-bold";

export default function Heading({ children, className, level }: HeadingProps) {
  switch (level) {
    case 2:
      return (
        <h2 className={cn(`text-4xl ${commonClasses}`, className)}>
          {children}
        </h2>
      );
    case 3:
      return <h3 className={`text-3xl ${commonClasses}`}>{children}</h3>;
    case 4:
      return (
        <h4 className={cn(`text-2xl ${commonClasses}`, className)}>
          {children}
        </h4>
      );
    case 5:
      return (
        <h5 className={cn(`text-xl ${commonClasses}`, className)}>
          {children}
        </h5>
      );
    case 6:
      return (
        <h6 className={cn(`text-lg ${commonClasses}`, className)}>
          {children}
        </h6>
      );
    default:
      return (
        <h1
          className={cn(`text-5xl leading-normal ${commonClasses}`, className)}
        >
          {children}
        </h1>
      );
  }
}
