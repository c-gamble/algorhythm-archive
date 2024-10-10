"use server";

import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (session) return redirect("/dashboard");

    return (
        <section className="container h-screen flex items-center justify-center">
            <div className="w-[800px]">
                <LoginForm />
            </div>
        </section>
    );
}
