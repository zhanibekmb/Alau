"use client";

import { getAnonId } from "./anon-id";
import { clearReaderData, mergeFromServer, readReaderData, setSyncSink } from "./store";
import { MAX_SYNC_WORDS, opsFromState, type ReaderData, type SyncOp } from "./sync";

// The browser side of the reader data sync (T7). Rules live in src/lib/sync.ts.
//
// The outbox keeps every change until the server confirms it, so reading offline loses nothing.
// The owner key says whose data the local copy is: null means a guest's, which is imported once
// at the first sign-in on this browser (D7) together with the guest's anon id (E1B).

const OUTBOX_KEY = "alau:outbox:v1";
const OWNER_KEY = "alau:owner:v1";
const FLUSH_DELAY_MS = 1500;

let memoryOutbox: SyncOp[] = [];
let memoryOwner: string | null = null;

function readOutbox(): SyncOp[] {
  try {
    const raw = window.localStorage.getItem(OUTBOX_KEY);
    const ops: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(ops) ? (ops as SyncOp[]) : [];
  } catch {
    return memoryOutbox; // Storage blocked or damaged: keep the queue for this visit only.
  }
}

function writeOutbox(ops: SyncOp[]) {
  memoryOutbox = ops;
  try {
    if (ops.length > 0) window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(ops));
    else window.localStorage.removeItem(OUTBOX_KEY);
  } catch {
    // Kept in memory.
  }
}

function readOwner(): string | null {
  try {
    return window.localStorage.getItem(OWNER_KEY);
  } catch {
    return memoryOwner;
  }
}

function writeOwner(userId: string | null) {
  memoryOwner = userId;
  try {
    if (userId) window.localStorage.setItem(OWNER_KEY, userId);
    else window.localStorage.removeItem(OWNER_KEY);
  } catch {
    // Kept in memory.
  }
}

let activeUser: string | null = null;
let running: Promise<void> | null = null;
let queuedRun: { pull: boolean } | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

function queue(op: SyncOp) {
  writeOutbox([...readOutbox(), op]);
  clearTimeout(timer);
  timer = setTimeout(() => void run(false), FLUSH_DELAY_MS);
}

/** Starts syncing for a signed-in reader: imports guest data if needed and pulls the account's data. */
export function startSync(userId: string) {
  activeUser = userId;
  setSyncSink(queue);
  void run(true);
}

export function stopSync() {
  activeUser = null;
  setSyncSink(null);
  clearTimeout(timer);
}

/** Sends the queue and pulls fresh data, e.g. when the tab comes back or the network returns. */
export function requestSync() {
  if (activeUser) void run(true);
}

/** Sign-out: try to send what is queued, then remove the account's data from this browser. */
export async function flushBeforeSignOut() {
  await Promise.race([run(false), new Promise((resolve) => setTimeout(resolve, 3000))]);
}

export function forgetAccountData() {
  stopSync();
  writeOutbox([]);
  writeOwner(null);
  clearReaderData();
}

async function run(pull: boolean): Promise<void> {
  if (running) {
    queuedRun = { pull: pull || Boolean(queuedRun?.pull) };
    return running;
  }
  running = syncOnce(pull)
    .catch(() => {
      // Offline or the server is down: the outbox stays and is sent next time.
    })
    .finally(() => {
      running = null;
    });
  await running;
  if (queuedRun) {
    const next = queuedRun;
    queuedRun = null;
    await run(next.pull);
  }
}

/** The newest words first, so a guest with more than the limit keeps the ones they saved last. */
function guestOps(data: ReaderData): SyncOp[] {
  const words = Object.values(data.words)
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, MAX_SYNC_WORDS);
  return opsFromState({ ...data, words: Object.fromEntries(words.map((w) => [w.id, w])) });
}

async function syncOnce(pull: boolean) {
  const userId = activeUser;
  if (!userId) return;

  const owner = readOwner();
  if (owner && owner !== userId) {
    // The local copy belongs to another account (sign-out did not finish): never import it.
    writeOutbox([]);
    writeOwner(null);
    clearReaderData();
  }
  const importing = readOwner() !== userId;
  const outbox = readOutbox();
  if (!importing && !pull && outbox.length === 0) return;

  const ops = importing ? [...guestOps(readReaderData()), ...outbox] : outbox;
  const response = await fetch("/api/me/sync", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ops, anonId: importing ? getAnonId() : null, pull: pull || importing }),
  });
  if (activeUser !== userId) return; // Signed out while the request was in flight.

  if (response.status === 400 || response.status === 413) {
    // The server will never accept these ops; drop them so later changes are not stuck behind them.
    console.warn(`[sync] the server refused the queued changes (${response.status})`);
  } else if (!response.ok) {
    return; // 401, 429, 503: keep the queue and try again later.
  }

  writeOutbox(readOutbox().slice(outbox.length));
  writeOwner(userId);
  if (response.status === 200) {
    const data = (await response.json()) as ReaderData;
    mergeFromServer(data, readOutbox());
  }
}
