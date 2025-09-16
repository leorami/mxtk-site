export function stripMarkdown(s: string): string {
  try {
    return String(s || '')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/[*_~>#-]+/g, '')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .replace(/\s+\n/g, '\n')
      .trim()
  } catch {
    return String(s || '')
  }
}


