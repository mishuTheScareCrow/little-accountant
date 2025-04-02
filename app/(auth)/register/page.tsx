"use client";

import AuthForm from "@/components/auth/AuthForm";
import { registerSchema } from "@/lib/validations";

const page = () => {
  return (
    <AuthForm
      type="REGISTER"
      schema={registerSchema}
      defaultValues={{ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" }}
      onSubmit={() => {}}
    />
  );
};

export default page;
