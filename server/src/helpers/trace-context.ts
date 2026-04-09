import type { FastifyRequest, RawServerBase, RawServerDefault, RequestGenericInterface } from 'fastify';

export interface TraceContext {
  trace_id: string;
  span_id: string;
}

export const getTraceContext = (
  req: FastifyRequest<RequestGenericInterface, RawServerBase | RawServerDefault>,
): TraceContext => {
  const otel = req.opentelemetry();

  if (otel.enabled) {
    const { traceId: trace_id, spanId: span_id } = otel.span.spanContext();

    return { trace_id, span_id };
  }

  return { trace_id: '', span_id: '' };
};
