import { trace } from '@opentelemetry/api';

export const tracer = trace.getTracer('kabin-frontend-client');
