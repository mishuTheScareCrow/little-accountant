"use client";

import AuthForm from "@/components/auth/AuthForm";
import { signUp } from "@/lib/actions/auth";
import { registerSchema } from "@/lib/validations";

const page = () => {
  return (
    <AuthForm
      type="REGISTER"
      schema={registerSchema}
      defaultValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }}
      onSubmit={signUp}
    />
  );
};

export default page;
