"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { signUpSchema } from "@/schemas/signUpschema";
import { CSSProperties } from "react";

// Add separate CSS styles instead of Tailwind classes
const styles: Record<string, CSSProperties> = {
  formContainer: {
    maxWidth: "450px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
  },
  headerContainer: {
    textAlign: "center" as const, // Properly typed as TextAlign
    marginBottom: "1.5rem"
  },
  heading: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1a202c",
    marginBottom: "0.5rem"
  },
  subHeading: {
    fontSize: "1rem",
    color: "#4a5568"
  },
  errorAlert: {
    marginBottom: "1rem",
    padding: "0.75rem",
    backgroundColor: "#FEF2F2",
    color: "#B91C1C",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center"
  },
  formGroup: {
    marginBottom: "1.25rem"
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.25rem"
  },
  inputWrapper: {
    position: "relative"
  },
  iconLeft: {
    position: "absolute",
    top: "50%",
    left: "0.75rem",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#9CA3AF"
  },
  input: {
    width: "77%",
    paddingLeft: "2.5rem",
    paddingRight: "2.5rem",
    paddingTop: "0.625rem",
    paddingBottom: "0.625rem",
    borderRadius: "6px",
    border: "1px solid #D1D5DB",
    fontSize: "1rem",
    transition: "all 0.2s",
    outline: "none"
  },
  inputFocus: {
    borderColor: "#3B82F6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.25)"
  },
  toggleButton: {
    position: "absolute",
    top: "50%",
    right: "0.75rem",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF"
  },
  errorMessage: {
    marginTop: "0.25rem",
    fontSize: "0.875rem",
    color: "#DC2626"
  },
  termsContainer: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "1.25rem"
  },
  termsIcon: {
    marginRight: "0.5rem",
    marginTop: "0.125rem",
    flexShrink: "0",
    color: "#3B82F6"
  },
  termsText: {
    fontSize: "0.875rem",
    color: "#4B5563"
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    color: "#ffffff",
    fontWeight: "500",
    padding: "0.625rem",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginBottom: "1rem"
  },
  submitButtonHover: {
    backgroundColor: "#1D4ED8"
  },
  submitButtonDisabled: {
    opacity: "0.7",
    cursor: "not-allowed"
  },
  footer: {
    marginTop: "1.5rem",
    textAlign: "center" as const,
    fontSize: "0.875rem",
    color: "#4B5563"
  },
  link: {
    fontWeight: "500",
    color: "#2563EB",
    textDecoration: "none" as const
  },
  linkHover: {
    color: "#1D4ED8",
    textDecoration: "underline" as const
  }
};

export default function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State for input focus
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: Record<string, any>) => {
    if (!isLoaded) return;

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (error: any) {
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-up. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <div style={styles.headerContainer}>
        <h1 style={styles.heading}>Create Your Account</h1>
        <p style={styles.subHeading}>Sign up to start managing your images securely</p>
      </div>

      {authError && (
        <div style={styles.errorAlert}>
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <div style={styles.inputWrapper}>
            <div style={styles.iconLeft}>
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              style={{
                ...styles.input,
                ...(focusedInput === 'email' ? styles.inputFocus : {})
              }}
              {...register("email")}
              onFocus={() => setFocusedInput('email')}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
          {errors.email && (
            <p style={styles.errorMessage}>{(errors.email as any).message}</p>
          )}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <div style={styles.inputWrapper}>
            <div style={styles.iconLeft}>
              <Lock size={18} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(focusedInput === 'password' ? styles.inputFocus : {})
              }}
              {...register("password")}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />
            <button
              type="button"
              style={styles.toggleButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          {errors.password && (
            <p style={styles.errorMessage}>{(errors.password as any).message}</p>
          )}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>
            Confirm Password
          </label>
          <div style={styles.inputWrapper}>
            <div style={styles.iconLeft}>
              <Lock size={18} />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(focusedInput === 'confirmPassword' ? styles.inputFocus : {})
              }}
              {...register("passwordConfirmation")}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput(null)}
            />
            <button
              type="button"
              style={styles.toggleButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
          {errors.passwordConfirmation && (
            <p style={styles.errorMessage}>{(errors.passwordConfirmation as any).message}</p>
          )}
        </div>

        <div style={styles.termsContainer}>
          <span style={styles.termsIcon}>
            <CheckCircle size={20} />
          </span>
          <p style={styles.termsText}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.submitButton,
            ...(isSubmitting ? styles.submitButtonDisabled : {})
          }}
          onMouseOver={(e) => {
            if (!isSubmitting) {
              // Apply hover styles as a complete style object
              Object.assign(e.currentTarget.style, {
                backgroundColor: styles.submitButtonHover.backgroundColor || "#1D4ED8"
              });
            }
          }}
          onMouseOut={(e) => {
            if (!isSubmitting) {
              // Reset to original style
              Object.assign(e.currentTarget.style, {
                backgroundColor: styles.submitButton.backgroundColor || "#2563EB"
              });
            }
          }}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link 
            href="/sign-in" 
            style={styles.link}
            onMouseOver={(e) => {
              // Apply hover styles as a complete style object
              Object.assign(e.currentTarget.style, {
                color: styles.linkHover.color || "#1D4ED8",
                textDecoration: styles.linkHover.textDecoration || "underline"
              });
            }}
            onMouseOut={(e) => {
              // Reset to original style
              Object.assign(e.currentTarget.style, {
                color: styles.link.color || "#2563EB",
                textDecoration: styles.link.textDecoration || "none"
              });
            }}
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}