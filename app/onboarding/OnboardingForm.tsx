"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-200";

export default function OnboardingForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "submitting" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/login?callbackUrl=/onboarding");
          return null;
        }
        return res.json().catch(() => null);
      })
      .then((data) => {
        if (data) {
          setDisplayName(data.displayName ?? "");
          setAvatarUrl(data.avatarUrl ?? "");
          setBio(data.bio ?? "");
        }
        setStatus("idle");
      })
      .catch(() => setStatus("idle"));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: displayName.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
        bio: bio.trim() || undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus("idle");
      setError(data.error ?? "Failed to update profile");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  if (status === "loading") {
    return (
      <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-slate-700">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          autoComplete="name"
          className={inputClass}
          placeholder="How should we call you?"
        />
      </div>
      <div>
        <label htmlFor="avatarUrl" className="block text-sm font-medium text-slate-700">
          Avatar URL
        </label>
        <input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
        {avatarUrl && (
          <div className="mt-2">
            <img
              src={avatarUrl}
              alt="Preview"
              className="h-16 w-16 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={inputClass}
          placeholder="Tell the community about yourself..."
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-violet-500 py-3.5 text-base font-semibold text-white transition-colors hover:bg-violet-600 disabled:opacity-50"
      >
        {status === "submitting" ? "Saving..." : "Continue to dashboard"}
      </button>
    </form>
  );
}
