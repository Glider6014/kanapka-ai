"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Logo } from "@/components/Logo";
import { signIn } from "next-auth/react";

//Form validation scheme
const formSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username cannot exceed 20 characters.")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, dashes, and underscores."
      ),
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character."
      ),
    confirmPassword: z
      .string()
      .min(8, "Password confirmation must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function Home() {
  const router = useRouter();

  //Use state to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  //Define a submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Signup error:", data.message);
      }

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col w-full max-w-6xl items-center justify-center">
        {/* Title - Kanapka AI */}
        <div className="mb-8">
          <Logo mobileFontSize="text-4xl" desktopFontSize="text-6xl" />
        </div>

        {/* Form */}
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <Tabs defaultValue="account">
            <TabsContent value="account">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Input - username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Input - email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Input - password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              {...field}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <EyeOff className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Input - re-enter password*/}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">
                          Re-enter Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter Password"
                              {...field}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showConfirmPassword ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <EyeOff className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Button - Sign up */}
                  <Button
                    type="submit"
                    className="w-full mt-4 font-bold hover:bg-gradient-to-r from-purple-700 to-orange-500 transition-transform transform hover:scale-105"
                  >
                    Sign up
                  </Button>
                </form>

                {/* Link to login form */}
                <div className="w-full border-t border-gray-200 mt-6 pt-4 text-center">
                  <p className="text-sm text-gray-700">
                    Already have an account?{" "}
                    <a
                      href="/user/signin"
                      className="text-purple-700 font-bold hover:underline"
                    >
                      Log in
                    </a>
                  </p>
                </div>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
