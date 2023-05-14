import { Heading } from "@/components/UI/atoms";
import { type HeadingProps as HeadingPrimitiveProps } from "@/components/UI/atoms/Heading/Heading";

interface HeadingProps extends Omit<HeadingPrimitiveProps, "level"> {
  type: "heading";
}
interface LogoProps extends React.HTMLAttributes<HTMLImageElement> {
  type: "logo";
  logo: string;
  width: string;
  height: string;
}

export type HeaderProps = HeadingProps | LogoProps;

export default function Header(props: HeaderProps) {
  return (
    <div className="flex items-center justify-center">
      {props.type === "logo" ? (
        <img src={props.logo} alt="image" {...props} />
      ) : (
        <Heading level={1} {...props}>
          {props.children}
        </Heading>
      )}
    </div>
  );
}
