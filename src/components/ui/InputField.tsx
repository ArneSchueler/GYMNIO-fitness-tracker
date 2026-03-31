import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputFieldProps {
  label: string;
  placeholder?: string; // Das Fragezeichen macht es optional
}
export function InputField({ label, placeholder }: InputFieldProps) {
  return (
    <Field className="gap-1">
      <FieldLabel
        className="text-xs text-muted-foreground ps-2 font-semibold"
        htmlFor="input-field-username"
      >
        {label}
      </FieldLabel>
      <Input id="input-field-username" type="text" placeholder={placeholder} />
    </Field>
  );
}
