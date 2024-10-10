"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import axios from "axios";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AlgorhythmLogo from "@/assets/logo.png";

const formSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters",
    }),
});

export const LoginForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const response = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (!response?.error) router.push("/dashboard");
        else toast.error("An error occurred. Please try again.");
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-center text-black"
            >
                <div className="w-full flex flex-col items-center justify-center">
                    <Image
                        src={AlgorhythmLogo.src}
                        height={64}
                        width={64}
                        alt="Algorhythm Logo"
                    />
                    <h1 className="text-[26px] mt-2 font-semibold text-black">
                        Sign in to Algorhythm
                    </h1>
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-[311px] text-[14px] mt-6">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    className="text-[14px]"
                                    placeholder="hello@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="w-[311px] text-[14px] mt-6">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-6 w-[311px] bg-navy">
                    Continue
                </Button>
                <p className="text-[14px] font-semibold text-left mt-4 text-black">
                    Don&apos;t have an account? Register{" "}
                    <Link href={"/register"} className="underline">
                        here
                    </Link>
                    .
                </p>
            </form>
        </Form>
    );
};
