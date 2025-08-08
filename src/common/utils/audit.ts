import { logger } from './logger';

type AuditEvent = {
  action: 'user.create' | 'user.update' | 'user.delete' | string;
  actor?: { id?: string; email?: string };
  resource?: { type: string; id?: string };
  success: boolean;
  metadata?: Record<string, unknown>;
  traceId?: string;
};

export function audit(event: AuditEvent) {
  logger.info('audit', event);
}
