import type { Metadata } from "next";
import OnboardingForm from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Complete your profile | AI Community Platform",
  description: "Set up your profile to get started.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <h1 className="text-center text-3xl font-bold text-slate-900">
            Complete your profile
          </h1>
          <p className="mt-2 text-center text-slate-600">
            Add a few details so others can find you in the community
          </p>
          <div className="mt-10">
            <OnboardingForm />
          </div>
        </div>
      </section>
    </div>
  );
}
