export interface RSQLQuery {
  field: string;
  operator: string;
  value: string | number | boolean;
}

export function parseRSQL(query: string): RSQLQuery[] {
  // Simplified RSQL parser - full implementation to be migrated
  const results: RSQLQuery[] = [];
  const parts = query.split(';');
  
  for (const part of parts) {
    const match = part.match(/(\w+)(==|!=|=gt=|=lt=|=ge=|=le=|=in=|=out=)(.+)/);
    if (match) {
      results.push({
        field: match[1],
        operator: match[2],
        value: match[3]
      });
    }
  }
  
  return results;
}

export function buildRSQL(queries: RSQLQuery[]): string {
  return queries
    .map(q => `${q.field}${q.operator}${q.value}`)
    .join(';');
}