import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign Up | AI Community Platform",
  description: "Create your AI Community Platform account. Start building intelligent communities for free.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <div className="text-center">
            <a href="/" className="text-2xl font-bold text-white">
              AI Community Platform
            </a>
            <h1 className="mt-8 text-3xl font-bold text-white">Create your account</h1>
            <p className="mt-2 text-slate-400">
              Start building intelligent communities for free
            </p>
          </div>
          <div className="mt-10">
            <SignupForm />
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-teal-400 hover:text-teal-300">
              Log in
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
