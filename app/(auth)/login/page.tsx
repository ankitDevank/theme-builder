"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validator/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { PATH } from "@/lib/path";

type Errors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };

    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      const newErrors: Errors = {};

      validation.error.issues.forEach((issue: any) => {
        const field = issue.path[0] as keyof Errors;
        if (!newErrors[field]) {
          newErrors[field] = issue.message;
        }
      });

      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
      setIsLoading(false);
      return;
    }

    toast.success("Login successful 🎉");
    router.push(PATH.ROOT);
    router.refresh();
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary/20">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6"
        noValidate
      >
        <h1 className="text-xl font-semibold text-center">Login</h1>

        {/* Email */}
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <PasswordInput
            name="password"
            placeholder="Password"
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer"
        >
          {isLoading ? "Signing in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
