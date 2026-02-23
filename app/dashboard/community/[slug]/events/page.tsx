"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";

type Event = {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  location: string | null;
  type: string;
  maxAttendees: number | null;
  _count: { rsvps: number };
};

export default function CommunityEventsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard/community/${slug}/events`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load events");
        return res.json();
      })
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
        <p className="text-amber-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Events</h1>
        <p className="mt-1 text-slate-400">
          Community events and meetups
        </p>
      </div>

      <div className="space-y-4">
        {events.map((e) => (
          <div
            key={e.id}
            className="rounded-2xl border border-slate-700/50 bg-slate-800/20 p-6 transition-all hover:border-slate-600/60"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">{e.title}</h3>
                {e.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {e.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>
                    {format(new Date(e.startAt), "EEE, MMM d, yyyy 'at' h:mm a")}
                  </span>
                  {e.location && (
                    <>
                      <span>•</span>
                      <span>{e.location}</span>
                    </>
                  )}
                  <span className="capitalize">• {e.type}</span>
                  {e.maxAttendees != null && (
                    <>
                      <span>•</span>
                      <span>Max {e.maxAttendees} attendees</span>
                    </>
                  )}
                </div>
              </div>
              <div className="shrink-0 rounded-lg bg-teal-500/20 px-4 py-2 text-center">
                <p className="text-2xl font-bold text-teal-400">{e._count.rsvps}</p>
                <p className="text-xs text-slate-400">RSVPs</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="rounded-2xl border border-slate-700/50 border-dashed bg-slate-800/20 p-12 text-center">
          <p className="text-slate-400">No events scheduled.</p>
        </div>
      )}
    </div>
  );
}
