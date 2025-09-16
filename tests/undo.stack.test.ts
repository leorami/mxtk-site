import { describe, it, expect } from 'vitest'
import { UndoStack } from '@/lib/home/undo'

const frame = (id: string, patch: any, inverse: any) => ({ id, ts: Date.now(), patch, inverse })

describe('UndoStack ring buffer', () => {
  it('push/undo/redo basic', () => {
    const s = new UndoStack(5)
    s.push(frame('f1', { widgets: [{ id: 'w1', pos: { x: 1, y: 1 } }] }, { widgets: [{ id: 'w1', pos: { x: 0, y: 0 } }] }))
    s.push(frame('f2', { widgets: [{ id: 'w1', pos: { x: 2, y: 2 } }] }, { widgets: [{ id: 'w1', pos: { x: 1, y: 1 } }] }))
    expect(s.canUndo()).toBe(true)
    const u1 = s.undo()
    expect(u1?.id).toBe('f2')
    expect(s.canRedo()).toBe(true)
    const r1 = s.redo()
    expect(r1?.id).toBe('f2')
  })

  it('clears redo on push after undo', () => {
    const s = new UndoStack(5)
    s.push(frame('a', { widgets: [] }, { widgets: [] }))
    s.push(frame('b', { widgets: [] }, { widgets: [] }))
    s.undo()
    expect(s.canRedo()).toBe(true)
    s.push(frame('c', { widgets: [] }, { widgets: [] }))
    expect(s.canRedo()).toBe(false)
  })

  it('enforces limit (ring buffer)', () => {
    const s = new UndoStack(3)
    s.push(frame('1', {}, {}))
    s.push(frame('2', {}, {}))
    s.push(frame('3', {}, {}))
    s.push(frame('4', {}, {}))
    const j = s.toJSON()
    expect(j.frames.length).toBe(3)
    expect(j.frames[0].id).toBe('2')
    expect(j.pointer).toBe(2)
  })

  it('serialize/deserialize', () => {
    const s = new UndoStack(2)
    s.push(frame('x', { a: 1 }, { a: 0 }))
    const j = s.toJSON()
    const s2 = UndoStack.fromJSON(j)
    expect(s2.canUndo()).toBe(true)
    expect(s2.toJSON().frames[0].id).toBe('x')
  })
})


