"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FieldLabel, Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form-nextjs";
import Link from "next/link";
import * as z from "zod";
import { urls } from "@/utils/env";
import { APIResponse } from "@/types/api";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password should be minimum 8 characters")
    .max(32, "Password should be maximum 32 characters"),
});

const SignUpCard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setIsLoading(true);

      try {
        const response = await fetch(urls.SIGNUP_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            first_name: value.firstName,
            last_name: value.lastName,
            email: value.email,
            password: value.password,
          }),
        });
        const result = (await response.json()) as APIResponse;

        if (!result.success) throw new Error(`${result.error}`);

        localStorage.setItem("access_token", result.data.access_token);

        router.replace("/home");
      } catch (error) {
        console.error("Sign up error: ", error);
      } finally {
        setIsLoading(false);
      }
    },

    validators: {
      onSubmit: signInSchema,
    },
  });

  return (
    <Card className="max-w-xl px-8 py-10">
      <CardHeader>
        <CardTitle className="font-display font-bold text-2xl">
          Create research account
        </CardTitle>
        <CardDescription>
          Free 14-day trail on Researcher Pro. No credit card required.
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
            <div className="flex items-center gap-2">
              <form.Field
                name="firstName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                      <Input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        placeholder="John"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="lastName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                      <Input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        placeholder="Doe"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
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
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Research Account"
              )}
            </Button>
            <div className="mt-4">
              Already registered?{" "}
              <Link href="/login" className="text-primary">
                Sign in here
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
