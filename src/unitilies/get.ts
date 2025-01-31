export default function get(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let result: Record<string, unknown> | undefined = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key] as Record<string, unknown> | undefined;
    } else {
      return undefined;
    }
  }

  return result;
}
