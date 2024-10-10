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
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AlgorhythmLogo from "@/assets/logo.png";

const formSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address."),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters",
        }),
        confirmPassword: z.string().min(8, {
            message: "Password must be at least 8 characters",
        }),
        inviteCode: z.string(),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
        if (password !== confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match.",
                path: ["confirmPassword"],
            });
        }
    });

export const RegisterForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            inviteCode: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/auth/register", values);
            if (response.status === 201) {
                toast.success("Account created! You can now log in.");
                return router.push("/login");
            } else if (response.status === 409) {
                toast.error("An account with that email already exists.");
                return router.push("/login");
            }
            // If we reach here, it means we got an unexpected status code
            throw new Error("Unexpected response status");
        } catch (error: any) {
            // Error handling remains the same
            if (error.response?.status === 409)
                toast.error("An account with that email already exists.");
            else if (error.response?.status === 400)
                toast.error("Could not find any matching organization.");
            else if (error.response?.status === 403)
                toast.error(
                    "You are not allowed to register for this organization.",
                );
            else
                toast.error(
                    "An error occurred. Please try again or contact support.",
                );
        }
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
                        Register for Algorhythm
                    </h1>
                </div>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-[311px] text-[14px] mt-6">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    className="text-[14px]"
                                    placeholder="John Doe"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="w-[311px] text-[14px] mt-6">
                            <FormLabel>Confirm Password</FormLabel>
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
                <FormField
                    control={form.control}
                    name="inviteCode"
                    render={({ field }) => (
                        <FormItem className="w-[311px] text-[14px] mt-6">
                            <FormLabel>Invite Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your invite code"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="mt-6 w-[311px] bg-navy">
                    Register
                </Button>
                <p className="text-[14px] font-semibold text-left mt-4 text-black">
                    Already have an account? Login{" "}
                    <Link href={"/login"} className="underline">
                        here
                    </Link>
                    .
                </p>
            </form>
        </Form>
    );
};
