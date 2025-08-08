import client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [50, 100, 200, 300, 500, 1000, 2000, 5000],
});

register.registerMetric(httpRequestDuration);

export function metricsMiddleware() {
  return async (_req: any, res: any) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  };
}
