"use client"

import Sidebar from "@/components/Sidebar";
import {Navbar} from "@/components/Navbar";

import {
    toast
} from "sonner"
import {
    useForm
} from "react-hook-form"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"

const formSchema = z.object({
    name: z.string().max(100).optional(),
    Email: z.string().max(100).optional(),
    Phone: z.string().optional(),
    name_4364857882: z.tuple([z.string(), z.string().optional()])
});


export default function Home() {
    const form = useForm < z.infer < typeof formSchema >> ({
        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer < typeof formSchema > ) {
        try {
            console.log(values);
            toast(
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
            );
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Navbar />
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Sidebar />

                <div className="flex-1 p-6 bg-gray-50 md:ml-72">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="You username"

                                                type="text"
                                                {...field} />
                                        </FormControl>
                                        <FormDescription>Your name may appear around Kanapka AI where you contribute or are mentioned</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="Email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Email"

                                                type="email"
                                                {...field} />
                                        </FormControl>
                                        <FormDescription>Email</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
