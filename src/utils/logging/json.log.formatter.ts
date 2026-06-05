import { format } from 'winston';
import { logContextStorage } from '../../middleware/logging/log.context.injector';

export const jsonLogFormatter = format((info) => {
  const context = logContextStorage.getStore();
  
  const formatted = {
    timestamp: new Date().toISOString(),
    level: info.level.toUpperCase(),
    message: info.message,
    ...context,
    ...info,
  };

  delete (formatted as any)[Symbol.for('level')];
  delete (formatted as any)[Symbol.for('message')];
  delete (formatted as any)[Symbol.for('splat')];

  info[Symbol.for('message') as any] = JSON.stringify(formatted);
  return info;
});