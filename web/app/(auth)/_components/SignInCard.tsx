"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  FieldGroup,
  FieldLabel,
  Field,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form-nextjs";
import Link from "next/link";
import * as z from "zod";

const signInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password should be minimum 8 characters")
    .max(32, "Password should be maximum 32 characters"),
});

const SignInCard = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Value: ", value);
    },

    validators: {
      onSubmit: signInSchema,
    },
  });

  return (
    <Card className="max-w-xl px-8 py-10">
      <CardHeader>
        <CardTitle className="font-display font-bold text-2xl">
          Welcome back
        </CardTitle>
        <CardDescription>
          Enter your institutional or research credentials{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(e);
          }}
        >
          <div className="flex flex-col gap-2 items-center">
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      placeholder="researcher@ucla.com"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link href="/forgot-password" className="text-primary">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      type="password"
                      placeholder="Your password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <Button type="submit" className="mt-2 py-5 self-stretch">
              Sign in to AskPDF
            </Button>

            <div className="mt-4">
              New to AskPDF?{" "}
              <Link href="/signup" className="text-primary">
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
