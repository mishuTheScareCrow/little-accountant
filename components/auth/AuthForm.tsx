"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES } from "@/constants";
import { FIELD_TYPES } from "@/constants";

// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

interface Props<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "LOGIN" | "REGISTER";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
  const isLogin = type === "LOGIN";
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {};

  //   const router = useRouter();
  // const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // const loginWithGoogle = async () => {
  //   setIsLoading(true);
  //   try {
  //     await signIn("google");
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl text-white">{isLogin ? "Welcome Back to Little Accountant!" : "Register at Little Accountant!"}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
          {Object.keys(defaultValues).map((field) => {
            return (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}</FormLabel>
                    <FormControl>
                      <Input type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} {...field} className="form-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}

          <Button type="submit" className="form-btn">
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>
      </Form>
      <p className="flex justify-center text-sm text-center text-muted-foreground">
        {isLogin ? "New to Little Accountant? " : "Already have an account? "}
        <Link href={isLogin ? "/register" : "/login"} className="text-primary hover:underline">
          {isLogin ? "Register" : "Login"}
        </Link>
      </p>
    </div>

    // <Card>
    //   <CardContent className="pt-6">
    //     <div className="flex flex-col space-y-4">
    //       <Button variant="outline" type="button" disabled={isLoading} onClick={loginWithGoogle} className="w-full">
    //         {isLoading ? (
    //           <span className="flex items-center justify-center">
    //             <svg
    //               className="mr-2 h-4 w-4 animate-spin"
    //               xmlns="http://www.w3.org/2000/svg"
    //               width="24"
    //               height="24"
    //               viewBox="0 0 24 24"
    //               fill="none"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //             >
    //               <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    //             </svg>
    //             Loading...
    //           </span>
    //         ) : (
    //           <span className="flex items-center justify-center">
    //             <svg
    //               className="mr-2 h-4 w-4"
    //               xmlns="http://www.w3.org/2000/svg"
    //               width="24"
    //               height="24"
    //               viewBox="0 0 24 24"
    //               fill="none"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //             >
    //               <circle cx="12" cy="12" r="10" />
    //               <path d="M17.13 14.93a5 5 0 1 0-10.25 0" />
    //               <path d="M12 20v-6" />
    //             </svg>
    //             Sign in with Google
    //           </span>
    //         )}
    //       </Button>
    //     </div>
    //   </CardContent>
    // </Card>
  );
};

export default AuthForm;
