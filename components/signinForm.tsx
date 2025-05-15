"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { signInSchema } from "@/schemas/signinSchema";
import "./signinForm.css";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setAuthError("Sign-in could not be completed. Please try again.");
      }
    } catch (error: any) {
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1>Welcome Back</h1>
        <p>Sign in to access your secure cloud storage</p>
      </div>

      <Divider />

      <div className="card-body">
        {authError && (
          <div className="auth-error">
            <AlertCircle className="icon" />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label htmlFor="identifier">Email</label>
            <Input
              id="identifier"
              type="email"
              placeholder="your.email@example.com"
              startContent={<Mail className="icon" />}
              isInvalid={!!errors.identifier}
              errorMessage={errors.identifier?.message}
              {...register("identifier")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              startContent={<Lock className="icon" />}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                </Button>
              }
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register("password")}
            />
          </div>

          <Button type="submit" color="primary" isLoading={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>

      <Divider />

      <div className="card-footer">
        <p>
          Don't have an account?{" "}
          <Link href="/sign-up" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
