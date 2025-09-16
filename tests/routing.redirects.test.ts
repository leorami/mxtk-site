import fs from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Routing redirects', () => {
  it('/dashboard redirects to /home', () => {
    const s = fs.readFileSync('app/dashboard/page.tsx','utf8')
    expect(s).toMatch(/redirect\('\/home'\)/)
  })

  it('/ (root) redirects to /home', () => {
    const s = fs.readFileSync('app/page.tsx','utf8')
    expect(s).toMatch(/redirect\('\/home'\)/)
  })

  it('/home renders DashboardContent', () => {
    const s = fs.readFileSync('app/home/page.tsx','utf8')
    expect(s).toMatch(/DashboardContent\s*\/>/)
  })
})


