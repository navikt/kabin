import { requiredEnvString } from '@app/config/env-var';
import { serverConfig } from '@app/config/server-config';

const getEnvironmentVersion = <T>(local: T, development: T, production: T): T => {
  if (isDeployedToDev) {
    return development;
  }

  if (isDeployedToProd) {
    return production;
  }

  return local;
};

const isDeployedToDev = serverConfig.cluster === 'dev-gcp';
const isDeployedToProd = serverConfig.cluster === 'prod-gcp';
export const isDeployed = isDeployedToDev || isDeployedToProd;
export const isLocal = !isDeployed;

export const ENVIRONMENT = getEnvironmentVersion('local', 'development', 'production');

const LOCAL_DOMAIN = `localhost:${serverConfig.port}`;
const LOCAL_URL = `http://${LOCAL_DOMAIN}`;

export const DEV_DOMAIN = 'kabin.intern.dev.nav.no';
export const DEV_URL = `https://${DEV_DOMAIN}`;

const PROD_DOMAIN = 'kabin.intern.nav.no';
const PROD_URL = `https://${PROD_DOMAIN}`;

export const URL: string = getEnvironmentVersion(LOCAL_URL, DEV_URL, PROD_URL);

export const NAIS_NAMESPACE = requiredEnvString('NAIS_NAMESPACE', 'none');

export const POD_NAME = requiredEnvString('OTEL_RESOURCE_ATTRIBUTES_POD_NAME', 'none');
