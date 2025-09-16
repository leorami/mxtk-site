// lib/home/undo.ts
// A small, pure ring buffer undo/redo stack with JSON serialization.
import type { UndoFrame } from './types';

export class UndoStack {
  private frames: UndoFrame[] = [];
  private pointer: number = -1; // index of last applied frame; -1 when empty
  private readonly limit: number;

  constructor(limit: number = 50) {
    if (!Number.isFinite(limit) || limit <= 0) {
      throw new Error('UndoStack limit must be a positive finite number');
    }
    this.limit = Math.floor(limit);
  }

  push(frame: UndoFrame): void {
    // If we have undone some frames, discard all redo history beyond pointer
    if (this.pointer < this.frames.length - 1) {
      this.frames = this.frames.slice(0, this.pointer + 1);
    }
    this.frames.push(frame);
    // Enforce ring buffer size limit (drop oldest while keeping the newest up to limit)
    if (this.frames.length > this.limit) {
      const overflow = this.frames.length - this.limit;
      this.frames.splice(0, overflow);
      this.pointer = this.frames.length - 1; // after trimming, pointer should point to last pushed
    } else {
      this.pointer = this.frames.length - 1;
    }
  }

  canUndo(): boolean {
    return this.pointer >= 0;
  }

  canRedo(): boolean {
    return this.pointer < this.frames.length - 1;
  }

  // Returns the frame to apply (inverse of pointer frame) and moves pointer backward
  undo(): UndoFrame | undefined {
    if (!this.canUndo()) return undefined;
    const frame = this.frames[this.pointer];
    this.pointer -= 1;
    return frame;
  }

  // Returns the frame to re-apply (the next frame after pointer) and moves pointer forward
  redo(): UndoFrame | undefined {
    if (!this.canRedo()) return undefined;
    this.pointer += 1;
    return this.frames[this.pointer];
  }

  peek(): UndoFrame | undefined {
    if (this.pointer < 0 || this.pointer >= this.frames.length) return undefined;
    return this.frames[this.pointer];
  }

  clear(): void {
    this.frames = [];
    this.pointer = -1;
  }

  toJSON(): { limit: number; pointer: number; frames: UndoFrame[] } {
    return { limit: this.limit, pointer: this.pointer, frames: this.frames };
  }

  static fromJSON(json: unknown): UndoStack {
    if (!json || typeof json !== 'object') return new UndoStack();
    const { limit, pointer, frames } = json as any;
    const stack = new UndoStack(Number.isFinite(limit) && limit > 0 ? limit : 50);
    if (Array.isArray(frames)) {
      stack.frames = frames as UndoFrame[];
      const maxPointer = Math.min(stack.frames.length - 1, typeof pointer === 'number' ? pointer : stack.frames.length - 1);
      stack.pointer = Math.max(-1, maxPointer);
    }
    return stack;
  }
}

export default UndoStack;


