import { NextResponse } from "next/server";
import { storeEvent, validateEvent } from "./logic";

export async function POST(req:Request){
  const e = validateEvent(await req.json());
  const cookie = req.headers.get("cookie") || "";
  const homeId = /(?:^|; )mxtk_home_id=([^;]+)/.exec(cookie)?.[1] || null;
  await storeEvent(homeId, e);
  return NextResponse.json({ ok:true });
}

export async function GET(){
  return NextResponse.json({ ok:false, error:'Method not allowed' }, { status: 405 });
}


