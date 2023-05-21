import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export type MessageInputProps = {
  errors: FieldErrors;
  id: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  required?: boolean;
  type?: string;
};
