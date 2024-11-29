"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
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
import {
  SignInFormData,
  signInFormSchema,
} from "@/lib/formSchemas/authFormSchemas";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //Define a submit handler
  async function onSubmit(values: SignInFormData) {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      form.setError("email", {
        type: "manual",
        message: "Invalid email or password",
      });

      form.setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });

      return;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-[93%] max-w-6xl items-center justify-between flex-col md:flex-row">
        {/* Title and description section */}
        <div className="w-full md:w-1/2 pr-8 mb-8 md:mb-0">
          <Logo className="text-5xl md:text-6xl" />
          <p className="text-xl mt-4 text-gray-600 leading-relaxed hidden md:block">
            Welcome to Kanapka AI - your intelligent assistant. Sign in, to
            start using our unique features.
          </p>
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 bg-white p-5 rounded-lg shadow-md mx-4 sm:mx-auto">
          <Tabs defaultValue="account">
            <TabsContent value="account">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Input email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg">E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Input password */}
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

                  {/* Link - Forgot password */}
                  <a
                    href="#"
                    className="block font-bold text-sm text-gray-500 text-right hover:underline"
                  >
                    Forgot Password?{" "}
                  </a>

                  {/* Button - Sign in */}
                  <Button
                    type="submit"
                    className="w-full mt-4 font-bold hover:bg-gradient-to-r from-purple-700 to-orange-500 transition-transform transform hover:scale-105"
                  >
                    Log in
                  </Button>
                </form>

                {/* Link to registration form */}
                <div className="w-full border-t border-gray-200 mt-6 pt-4 text-center">
                  <p className="text-sm text-gray-700">
                    New?{" "}
                    <a href="/user/signup" className="text-gray-500">
                      <span className="text-purple-700 font-bold hover:underline">
                        Sign up
                      </span>{" "}
                    </a>
                    - and make your sandwich!
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
