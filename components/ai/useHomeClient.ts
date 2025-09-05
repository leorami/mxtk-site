"use client";
import { getApiPath } from '@/lib/basepath';

export function getHomeId() {
  try { return document.cookie.split('; ').find(x => x.startsWith('mxtk_home_id='))?.split('=')[1] || null } catch { return null }
}
export function setHomeId(id: string) {
  document.cookie = `mxtk_home_id=${id}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
export async function addWidgetToHome(init: { title: string; type: string; props?: any }) {
  let id = getHomeId();
  if (!id) { id = Math.random().toString(36).slice(2, 10); setHomeId(id); }
  const res = await fetch(getApiPath(`/api/home/${id}`), { method: 'GET' });
  let home = res.ok ? (await res.json()).home : { id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), widgets: [] };
  home.widgets = [{ id: (globalThis.crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2), type: init.type, title: init.title, props: init.props || {}, new: true }, ...home.widgets];
  await fetch(getApiPath(`/api/home/${id}`), { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ home }) });
  return id;
}


