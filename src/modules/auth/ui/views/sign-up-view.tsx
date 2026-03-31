"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z
  .object({
    name: z.string().min(1, "Name must be at least 2 characters."),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false); // FIXED: Reset pending state on error
          setError(error.message ?? "Invalid email or password");
        },
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false); // FIXED: Reset pending state on error
          setError(error.message ?? "Invalid email or password");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0 bg-black/40 backdrop-blur-xl border-emerald-500/20 shadow-2xl shadow-emerald-500/10 hover:border-emerald-500/40 hover:shadow-emerald-500/20 transition-all duration-500">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-1 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent [animation:gradient_3s_ease_infinite] [background-size:200%_auto]">
                    Let's get started
                  </h1>
                  <p className="text-gray-400 text-base">Create your account</p>
                </div>

                {/* Name Field */}
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-400 text-sm font-medium">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Your name"
                            className="bg-black/50 border-emerald-500/30 text-white placeholder:text-gray-600 h-11 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 hover:border-emerald-500/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-400 text-sm font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="abc@gmail.com"
                            className="bg-black/50 border-emerald-500/30 text-white placeholder:text-gray-600 h-11 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 hover:border-emerald-500/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-400 text-sm font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            className="bg-black/50 border-emerald-500/30 text-white placeholder:text-gray-600 h-11 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 hover:border-emerald-500/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-400 text-sm font-medium">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            className="bg-black/50 border-emerald-500/30 text-white placeholder:text-gray-600 h-11 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 hover:border-emerald-500/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Error Alert */}
                {!!error && (
                  <Alert className="bg-red-950/30 border-red-500/50 backdrop-blur-sm py-2">
                    <OctagonAlertIcon className="h-4 w-4 !text-red-400" />
                    <AlertTitle className="text-red-400 text-sm">
                      {error}
                    </AlertTitle>
                  </Alert>
                )}

                {/* Sign In Button */}
                <Button
                  disabled={pending}
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {pending ? "Signing up..." : "Sign Up"}
                </Button>

                {/* Divider */}
                <div className="relative text-center text-xs my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-emerald-500/20"></div>
                  </div>
                  <span className="relative bg-black/40 px-3 text-gray-500">
                    Or continue with
                  </span>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    disabled={pending}
                    onClick={() => onSocial("google")}
                    variant="outline"
                    type="button"
                    className="w-full h-10 bg-black/50 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:text-white text-sm"
                  >
                    <FaGoogle />
                  </Button>
                  <Button
                    disabled={pending}
                    onClick={() => onSocial("github")}
                    variant="outline"
                    type="button"
                    className="w-full h-10 bg-black/50 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:text-white text-sm"
                  >
                    <FaGithub />
                  </Button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center text-xs text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          {/* Brand Section */}
          <div className="relative hidden md:flex flex-col gap-y-4 items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-green-950 overflow-hidden">
            {/* Animated Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)]"></div>

            {/* Floating Orbs */}
            <div className="absolute top-1/4 left-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 right-1/2 w-36 h-36 bg-green-500/20 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Logo Container */}
            <div className="relative z-10 p-6 rounded-3xl bg-black/30 backdrop-blur-sm border border-emerald-500/20 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-500 hover:scale-105">
              <img
                src="/logo.svg"
                alt="VoxTrace Logo"
                className="h-20 w-20 drop-shadow-[0_0_30px_rgba(16,185,129,0.6)]"
              />
            </div>

            {/* Brand Name */}
            <p
              className="text-2xl font-bold text-white z-10 tracking-wide"
              style={{ textShadow: "0 0 20px rgba(16,185,129,0.5)" }}
            >
              VoxTrace.AI
            </p>

            {/* Decorative Particles */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-ping"></div>
            <div
              className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-emerald-400/60 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-2/3 right-1/4 w-1 h-1 bg-green-400/60 rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance">
        By clicking "Sign In", you agree to our{" "}
        <a href="/terms-of-service" target="_blank" rel="noreferrer">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};
