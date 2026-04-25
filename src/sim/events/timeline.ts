import type { Order, Report } from '../types/command';

export type TimelineEventType =
  | 'order_eta'
  | 'order_delivery'
  | 'order_ack'
  | 'cas_eta'
  | 'artillery_eta'
  | 'report_delivery';

export interface TimelineEventPayload {
  order?: Order;
  report?: Report;
  missionId?: string;
  [key: string]: unknown;
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  eta: number;
  createdAt: number;
  payload: TimelineEventPayload;
}

export type TimelineEventHandler = (event: TimelineEvent) => void;

export class TimelineQueue {
  private readonly events: TimelineEvent[] = [];

  schedule(event: TimelineEvent): TimelineEvent {
    const idx = this.events.findIndex((candidate) => candidate.eta > event.eta);
    if (idx === -1) {
      this.events.push(event);
    } else {
      this.events.splice(idx, 0, event);
    }

    return event;
  }

  scheduleIn(
    type: TimelineEventType,
    delayMs: number,
    payload: TimelineEventPayload,
    now = Date.now(),
  ): TimelineEvent {
    const eta = now + Math.max(0, delayMs);
    return this.schedule({
      id: `${type}-${eta}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      eta,
      createdAt: now,
      payload,
    });
  }

  cancel(eventId: string): boolean {
    const idx = this.events.findIndex((event) => event.id === eventId);
    if (idx < 0) {
      return false;
    }

    this.events.splice(idx, 1);
    return true;
  }

  peek(): TimelineEvent | undefined {
    return this.events[0];
  }

  size(): number {
    return this.events.length;
  }

  popDue(now = Date.now()): TimelineEvent[] {
    const dueCount = this.events.findIndex((event) => event.eta > now);
    if (dueCount === -1) {
      return this.events.splice(0, this.events.length);
    }
    if (dueCount === 0) {
      return [];
    }
    return this.events.splice(0, dueCount);
  }

  tick(now = Date.now(), handler?: TimelineEventHandler): TimelineEvent[] {
    const due = this.popDue(now);
    if (handler) {
      due.forEach(handler);
    }
    return due;
  }

  listPending(): readonly TimelineEvent[] {
    return this.events;
  }
}
