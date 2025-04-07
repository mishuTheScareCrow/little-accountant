"use client";

import AuthForm from "@/components/auth/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";
import { loginSchema } from "@/lib/validations";

export default function Page() {
  return <AuthForm type="LOGIN" schema={loginSchema} defaultValues={{ email: "", password: "" }} onSubmit={signInWithCredentials} />;
}

// src/app/(auth)/sign-in/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import Link from "next/link";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Loader2 } from "lucide-react";

// const formSchema = z.object({
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   password: z.string().min(6, {
//     message: "Password must be at least 6 characters.",
//   }),
// });

// export default function SignInPage() {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const result = await signIn("credentials", {
//         redirect: false,
//         email: values.email,
//         password: values.password,
//       });

//       if (result?.error) {
//         setError("Invalid email or password. Please try again.");
//         setIsLoading(false);
//         return;
//       }

//       router.push("/");
//       router.refresh();
//     } catch (error) {
//       setError("An unexpected error occurred. Please try again.");
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="flex h-screen items-center justify-center bg-gray-50">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">
//             Little Accountant
//           </CardTitle>
//           <CardDescription className="text-center">
//             Enter your email and password to sign in
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="you@example.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="••••••••" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-4">
//           <div className="text-sm text-center text-muted-foreground">
//             Don't have an account?{" "}
//             <Link href="/sign-up" className="text-primary hover:underline">
//               Sign up
//             </Link>
//           </div>
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-background px-2 text-muted-foreground">
//                 Or continue with
//               </span>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" className="w-full" onClick={() => signIn("google")}>
//               Google
//             </Button>
//             <Button variant="outline" className="w-full" onClick={() => signIn("github")}>
//               GitHub
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
