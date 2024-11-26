"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  usernameSchema,
  emailSchema,
  passwordSchema,
} from "@/lib/formSchemas/authFormSchemas";
import { z } from "zod";

const signUpFormSchemaWithConfirmPassword = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormWithConfirmPasswordData = z.infer<
  typeof signUpFormSchemaWithConfirmPassword
>;

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormWithConfirmPasswordData>({
    resolver: zodResolver(signUpFormSchemaWithConfirmPassword),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  //Define a submit handler
  async function onSubmit(values: SignUpFormWithConfirmPasswordData) {
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
          <Logo className="text-4xl md:text-6xl" />
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
