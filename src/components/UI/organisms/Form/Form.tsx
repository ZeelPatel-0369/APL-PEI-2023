import { FormInput } from "@/components/UI/molecules";
import type { FormInputProps } from "@/components/UI/molecules/FormInput";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formElements: Array<FormInputProps>;
}

export default function Form({ formElements, ...props }: FormProps) {
  return (
    <form {...props}>
      {formElements.map((formElement, index) => {
        switch (formElement.inputType) {
          case "input":
            return (
              <div key={index} className="mt-6">
                <FormInput {...formElement} />
              </div>
            );
          case "select":
            return (
              <div key={index} className="mt-6">
                <FormInput {...formElement} />
              </div>
            );
          case "slider":
            return (
              <div key={index} className="mt-6">
                <FormInput {...formElement} />
              </div>
            );
          case "submit":
            return (
              <div key={index} className="mt-6">
                <FormInput {...formElement} />
              </div>
            );
          default:
            return null;
        }
      })}
    </form>
  );
}
