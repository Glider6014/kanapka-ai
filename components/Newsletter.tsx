"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address.",
    })
    .nonempty({
      message: "Email is required.",
    }),
});

export default function Newsletter() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <div className="flex justify-center bg-gradient-to-r from-purple-700 to-orange-500 text-white">
        <div className="container m-20 p-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full md:w-auto mt-4 md:mt-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col items-center space-y-4"
                >
                  <FormLabel className="mb-6 text-4xl text-center font-bold">
                    Sign up for the Kanapka AI newsletter today!
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col items-center">
                        <div className="flex items-center">
                          <FormControl>
                            <Input
                              className={`rounded-l-full text-opacity-70 focus-visible:text-opacity-100 border-solid border-2  focus-visible:ring-0 focus-visible:bg-opacity-20 border-black px-4 py-2 placeholder:text-white placeholder:text-opacity-70 placeholder:focus-visible:text-opacity-90 ${
                                fieldState.invalid
                                  ? "text-red-500 border-red-500"
                                  : "text-white"
                              }`}
                              type="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            className="rounded-r-full bg-black font-bold hover:bg-gradient-to-r from-purple-700 to-orange-500 text-white px-6 py-2 transition-transform hover:scale-105 duration-200"
                            type="submit"
                          >
                            Sign up - it's free!
                          </Button>
                        </div>
                        <FormMessage className="text-white" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
