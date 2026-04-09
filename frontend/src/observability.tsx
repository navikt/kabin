import { ENVIRONMENT } from '@app/environment';
import { createReactRouterV7Options, ReactIntegration } from '@grafana/faro-react';
import { faro, getWebInstrumentations, initializeFaro, LogLevel, type PushLogOptions } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router-dom';

const SERVICE_NAME = 'kabin-frontend-client';

const getTelemetryCollectorURL = (): string | undefined => {
  if (ENVIRONMENT.isProduction) {
    return 'https://telemetry.nav.no/collect';
  }

  if (ENVIRONMENT.isDevelopment) {
    return 'https://telemetry.ekstern.dev.nav.no/collect';
  }

  if (window.location.hostname === 'localhost') {
    return '/collect';
  }

  return undefined;
};

const collectorUrl = getTelemetryCollectorURL();

if (collectorUrl !== undefined) {
  initializeFaro({
    url: collectorUrl,
    app: {
      name: SERVICE_NAME,
      version: ENVIRONMENT.version,
    },
    sessionTracking: {
      enabled: true,
      persistent: true,
    },
    instrumentations: [
      ...getWebInstrumentations(),
      new TracingInstrumentation(),
      new ReactIntegration({
        router: createReactRouterV7Options({
          createRoutesFromChildren,
          matchRoutes,
          Routes,
          useLocation,
          useNavigationType,
        }),
      }),
    ],
  });
}

export const pushEvent = (name: string, domain: string, attributes?: Record<string, string>) =>
  faro.api.pushEvent(name, attributes, domain, { skipDedupe: true });

/** @public */
export const pushLog = (message: string, options?: Omit<PushLogOptions, 'skipDedupe'>, level = LogLevel.DEBUG) =>
  faro.api.pushLog([message], { ...options, skipDedupe: true, level });

/** @public */
export const { pushMeasurement, pushError } = faro.api;
