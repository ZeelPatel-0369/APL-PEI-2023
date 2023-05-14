import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Paragraph,
  Slider,
  Textarea,
  Checkbox,
} from "@/components/UI/atoms";
import type { InputProps as InputPrimitiveProps } from "@/components/UI/atoms/Input";
import type { SliderProps as SliderPrimitiveProps } from "@/components/UI/atoms/Slider";
import {
  RadioGroup,
  RadioGroupItem,
  RadioProps as RadioPrimitiveProps,
} from "@/components/UI/atoms/Radio";
import type { CheckboxProps as CheckboxPrimitiveProps } from "@/components/UI/atoms/Checkbox";
import type { LabelProps } from "@/components/UI/atoms/Label";
import type { TextareaProps as TextareaPrimitiveProps } from "@/components/UI/atoms/Textarea";
import { cn, omitProps } from "@/lib/utils";
import type { SelectProps as SelectPrimitiveProps } from "@radix-ui/react-select";

export interface RadioOptions {
  label: string;
  value: string;
  id: string;
}
interface CommonProps {
  error?: string;
  labelProps: LabelProps;
  id: string;
  name: string;
}
interface InputProps
  extends CommonProps,
    Omit<InputPrimitiveProps, "id" | "name" | "type"> {
  inputType: "input";
  type:
    | "textarea"
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "date"
    | "file"
    | "checkbox"
    | "hidden";
}
interface SelectProps
  extends CommonProps,
    Omit<SelectPrimitiveProps, "id" | "name"> {
  inputType: "select";
  selectValue: string;
  selectOptions: string[];
  selectLabel: string;
}
interface SliderProps
  extends CommonProps,
    Omit<SliderPrimitiveProps, "id" | "name"> {
  inputType: "slider";
  required?: boolean;
}
interface RadioProps
  extends Omit<CommonProps, "id" | "name">,
    RadioPrimitiveProps {
  inputType: "radio";
  radioOptions: Array<RadioOptions>;
}
interface CheckboxProps
  extends CommonProps,
    Omit<CheckboxPrimitiveProps, "id" | "name"> {
  inputType: "checkbox";
}
interface TextareaProps
  extends CommonProps,
    Omit<TextareaPrimitiveProps, "id" | "name"> {
  inputType: "textarea";
}
export type FormInputProps =
  | SelectProps
  | InputProps
  | SliderProps
  | RadioProps
  | CheckboxProps
  | TextareaProps;

export default function FormInput(props: FormInputProps) {
  switch (props.inputType) {
    case "input": {
      return (
        <>
          <Label
            {...props.labelProps}
            htmlFor={props.id}
            required={props.required}
          />
          <Input
            {...omitProps(props, "inputType", "labelProps")}
            className={`${props.error ? "border-destructive" : ""}`}
          />
          {props.error ? <Error>{props.error}</Error> : null}
        </>
      );
    }
    case "select":
      return (
        <>
          <Label
            {...props.labelProps}
            htmlFor={props.id}
            required={props.required}
          />
          <Select {...omitProps(props, "inputType", "labelProps")}>
            <SelectTrigger
              className={`${props.error ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder={props.selectValue} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{props.selectLabel}</SelectLabel>
                {props.selectOptions.map((option) => (
                  <SelectItem key={option} value={option.toLocaleLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {props.error ? <Error>{props.error}</Error> : null}
        </>
      );
    case "slider": {
      return (
        <>
          <Label
            {...props.labelProps}
            htmlFor={props.id}
            required={props.required}
          />
          <Slider
            {...omitProps(props, "inputType", "labelProps", "className")}
            className={cn("mt-2", props.className)}
          />
          {props.error ? <Error>{props.error}</Error> : null}
        </>
      );
    }
    case "radio": {
      return (
        <>
          <Label
            {...props.labelProps}
            htmlFor={props.id}
            required={props.required}
          />
          <RadioGroup
            {...omitProps(
              props,
              "inputType",
              "labelProps",
              "radioOptions",
              "className"
            )}
            className={cn("mt-1", props.className)}
          >
            {props.radioOptions.map(({ value, label, id }) => (
              <div key={id} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={id} />
                <Label htmlFor={id}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </>
      );
    }
    case "checkbox": {
      return (
        <>
          <Label
            {...props.labelProps}
            htmlFor={props.id}
            className="mr-2"
            required={props.required}
          />
          <Checkbox
            {...omitProps(props, "inputType", "labelProps")}
            className={`${props.error ? "border-destructive" : ""}`}
          />
          {props.error ? <Error>{props.error}</Error> : null}
        </>
      );
    }
    case "textarea": {
      return (
        <>
          <Label
            {...props.labelProps}
            htmlFor={props.id}
            required={props.required}
          />
          <Textarea
            {...omitProps(props, "inputType", "labelProps")}
            className={`${props.error ? "border-destructive" : ""}`}
          />
          {props.error ? <Error>{props.error}</Error> : null}
        </>
      );
    }
    default:
      return null;
  }
}

function Error({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-1">
      <Paragraph className="text-destructive">{children}</Paragraph>
    </div>
  );
}
