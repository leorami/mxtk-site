import { describe, expect, it } from 'vitest';

describe('Header Sherpa', ()=>{
  it('dispatch open without throwing', ()=>{
    expect(()=>window.dispatchEvent(new CustomEvent('mxtk:guide:open',{ detail:{ prompt:'test', send:true } }))).not.toThrow();
  });
});


