"use client";

// import { z } from "zod";
import { ZodType } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "LOGIN" | "REGISTER";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
  const router = useRouter();

  const isSignIn = type === "LOGIN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    console.log("Submitting Data:", data);

    const result = await onSubmit(data);

    console.log("Submission Result:", result); // Debugging

    if (!result || typeof result.success === "undefined") {
      console.error("Invalid response from onSubmit:", result);
      toast("Unexpected error occurred.");
      return;
    }

    if (result.success) {
      toast(`${isSignIn ? "You have successfully logged in." : "You have successfully registered."}`);
      router.push("/");
    } else {
      toast(result.error || "An error occurred.");
    }
  };

  // const handleSubmit: SubmitHandler<T> = async (data) => {
  //   const result = await onSubmit(data);

  //   if (result.success) {
  //     toast(`${isSignIn ? "You have successfully logged in." : "You have successfully registered."}`);

  //     router.push("/");
  //   } else {
  //     toast(`${isSignIn ? "Error while logging in." : "Error while registering."}`);
  //   }
  // };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to Little Accountant" : "Register with Little Accountant"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                  <FormControl>
                    <Input required type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} {...field} className="form-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {isSignIn ? "Login" : "Register"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to Little Accountant? " : "Already have an account? "}

        <Link href={isSignIn ? "/register" : "/login"} className="font-bold text-primary">
          {isSignIn ? "Create an account" : "Login"}
        </Link>
      </p>
    </div>
  );
};
export default AuthForm;

//New
