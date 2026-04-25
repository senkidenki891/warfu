import React, { useMemo } from "react";

export type TimelineEventType = "artillery" | "cas" | "order" | "supply" | "smoke";

export type TimelineEvent = {
  id: string;
  atSec: number;
  type: TimelineEventType;
  title: string;
  detail?: string;
  side: "player" | "ai" | "neutral";
};

export type TimelinePanelProps = {
  nowSec: number;
  events: TimelineEvent[];
  horizonSec?: number;
};

const labels: Record<TimelineEventType, string> = {
  artillery: "Артудар",
  cas: "CAS/SEAD",
  order: "Приказ",
  supply: "Снабжение",
  smoke: "Дым",
};

export function TimelinePanel({ nowSec, events, horizonSec = 600 }: TimelinePanelProps) {
  const upcoming = useMemo(
    () =>
      events
        .filter((event) => event.atSec >= nowSec && event.atSec <= nowSec + horizonSec)
        .sort((a, b) => a.atSec - b.atSec),
    [events, horizonSec, nowSec],
  );

  return (
    <section aria-label="timeline-panel" style={{ padding: 12, border: "1px solid #2b2f36" }}>
      <header style={{ marginBottom: 8 }}>
        <strong>Будущие события</strong>
        <div style={{ opacity: 0.7, fontSize: 12 }}>Горизонт: {Math.round(horizonSec / 60)} мин</div>
      </header>

      {upcoming.length === 0 ? (
        <div style={{ opacity: 0.7 }}>Нет запланированных событий.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
          {upcoming.map((event) => (
            <li
              key={event.id}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 90px 1fr",
                gap: 8,
                alignItems: "baseline",
                borderBottom: "1px dashed #3a3f47",
                paddingBottom: 6,
              }}
            >
              <time>{formatClock(event.atSec)}</time>
              <span>{labels[event.type]}</span>
              <span>
                {event.title}
                {event.detail ? ` — ${event.detail}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatClock(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSec % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export default TimelinePanel;
