// lib/types/sync.ts
/**
 * Shape of a packet broadcast by the DJ and fanned out via Realtime.
 */
export interface SyncPacket {
  type: "sync" | "room_init";
  track_uri: string;
  position_ms: number;
  paused: boolean;
  ts: number; // Unix ms timestamp (Date.now() on the host)
}
