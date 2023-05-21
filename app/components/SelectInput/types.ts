export type SelectInputProps = {
  label: string;
  value?: Record<string, any>;
  options: Record<string, any>[];
  disabled?: boolean;
  onChange: (value: Record<string, any>) => void;
};
