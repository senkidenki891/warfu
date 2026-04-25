import { calculateCommandDelay, type CommandDelayInput } from '../command/commandDelay';
import { calculateStaffWorkload, type HQWorkloadInput } from '../command/workload';
import { TimelineQueue, type TimelineEvent } from '../events/timeline';
import type { Order, Report } from '../types/command';

export interface TransmissionContext {
  timeline: TimelineQueue;
  now?: number;
  rng?: () => number;
}

export interface TransmissionState {
  delayedOrders: Order[];
  failedOrders: Order[];
  pendingReports: Report[];
}

const defaultState = (): TransmissionState => ({
  delayedOrders: [],
  failedOrders: [],
  pendingReports: [],
});

export interface OrderIssueInput {
  order: Order;
  delayInput: CommandDelayInput;
  hq: HQWorkloadInput;
}

const eventDelay = (seconds: number): number => Math.round(seconds * 1000);

/** Create, evaluate and enqueue an order transmission. */
export function issueOrder(
  input: OrderIssueInput,
  context: TransmissionContext,
  state: TransmissionState = defaultState(),
): { order: Order; event: TimelineEvent; state: TransmissionState } {
  const workload = calculateStaffWorkload(input.hq);
  const delay = calculateCommandDelay({
    ...input.delayInput,
    workloadMultiplier: input.delayInput.workloadMultiplier * workload.delayMultiplier,
  });

  return transmitOrder(
    {
      ...input.order,
      status: delay.seconds > 180 ? 'delayed' : 'transmitting',
      reliability: Math.max(0.01, delay.reliability - workload.reliabilityPenalty),
    },
    delay.seconds,
    context,
    state,
  );
}

/** Transmit order and enqueue its ETA in the timeline queue. */
export function transmitOrder(
  order: Order,
  delaySeconds: number,
  context: TransmissionContext,
  state: TransmissionState = defaultState(),
): { order: Order; event: TimelineEvent; state: TransmissionState } {
  const now = context.now ?? Date.now();
  const eta = now + eventDelay(delaySeconds);

  const updated: Order = {
    ...order,
    eta,
    status: delaySeconds > 180 ? 'delayed' : 'transmitting',
  };

  if (updated.status === 'delayed') {
    state.delayedOrders.push(updated);
  }

  const event = context.timeline.scheduleIn('order_eta', eventDelay(delaySeconds), { order: updated }, now);

  return { order: updated, event, state };
}

/** Mark order as acknowledged (or failed) after reliability check. */
export function acknowledgeOrder(
  order: Order,
  context: TransmissionContext,
  state: TransmissionState = defaultState(),
): { order: Order; state: TransmissionState } {
  const rng = context.rng ?? Math.random;
  const reliability = order.reliability ?? 0.8;

  if (rng() <= reliability) {
    return {
      order: {
        ...order,
        status: 'acknowledged',
      },
      state,
    };
  }

  const failed = {
    ...order,
    status: 'failed' as const,
    retries: (order.retries ?? 0) + 1,
  };

  state.failedOrders.push(failed);

  return { order: failed, state };
}

/** Queue inbound report and schedule its delivery to HQ. */
export function deliverReport(
  report: Report,
  deliverySeconds: number,
  context: TransmissionContext,
  state: TransmissionState = defaultState(),
): { report: Report; event: TimelineEvent; state: TransmissionState } {
  const now = context.now ?? Date.now();
  const queuedReport = {
    ...report,
    timestamp: report.timestamp || now,
    acknowledged: false,
  };

  state.pendingReports.push(queuedReport);

  const event = context.timeline.scheduleIn(
    'report_delivery',
    eventDelay(deliverySeconds),
    { report: queuedReport },
    now,
  );

  return { report: queuedReport, event, state };
}
