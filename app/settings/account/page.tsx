"use client"

import Sidebar from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

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
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer<typeof formSchema>) {

    }

    return (
        <div className="container mx-auto p-4">
            <Navbar />
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Sidebar />

                <div className="flex-1 p-6 bg-gray-50 md:ml-72">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="Email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            We'll never share your email with anyone else.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Save Changes</Button>
                        </form>
                    </Form>
                    <div className="mt-8">
                        <p className="text-red-600 font-medium">Delete Account</p>
                        <hr className="my-2 border-red-200" />
                        <p>Once you delete your account, there is no going back. Please be certain.</p>
                        <button
                            type="button"
                            className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Delete Account
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
