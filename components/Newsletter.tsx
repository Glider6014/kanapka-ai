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
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Newsletter() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
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
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel className="mb-6 text-4xl text-center font-bold">
                          Get started with Kanapka AI today
                        </FormLabel>
                        <div className="flex items-center">
                          <FormControl>
                            <Input
                              className="rounded-l-full border-none px-4 py-2 text-black"
                              type="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            className="rounded-r-full bg-black font-bold hover:bg-gradient-to-r from-purple-700 to-orange-500 hover:opacity-90 text-white px-6 py-2 transition-transform transform hover:scale-105 duration-200"
                            type="submit"
                          >
                            Sign up - it’s free!
                          </Button>
                        </div>
                        <FormMessage />
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
