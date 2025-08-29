import { useBasePath } from '@/components/providers/BasePathProvider';

export function useRelativePath(target: string): string {
  const bp = useBasePath();
  const leaf = target.startsWith('/') ? target.slice(1) : target;
  if (!leaf) return `${bp}/`.replace(/\/{2,}/g, '/');
  return `${bp}/${leaf}`.replace(/\/{2,}/g, '/');
}


