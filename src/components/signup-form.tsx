import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useSignup } from "@/hooks/useSignup"; // Hook importieren

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { formData, setFormData, error, isLoading, handleSignup } = useSignup();

  // Kleiner Helper für die Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSignup}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive text-center">
            {error}
          </p>
        )}

        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            className="bg-background"
            value={formData.name}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
            value={formData.email}
            onChange={handleChange}
          />
          <FieldDescription>
            We&apos;ll use this to contact you.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={formData.password}
            onChange={handleChange}
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword" // ID muss zum Key im Hook passen!
            type="password"
            required
            className="bg-background"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="w-full">
            {/* SVG weggelassen für die Kürze */}
            Sign up with GitHub
          </Button>
          <FieldDescription className="px-6 text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
