import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  label: string;
  placeholder?: string; // Das Fragezeichen macht es optional
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
}
export function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: InputFieldProps) {
  return (
    <Field className="gap-1">
      <FieldLabel className="text-xs text-muted-foreground ps-2 font-semibold">
        {label}
      </FieldLabel>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Field>
  );
}
