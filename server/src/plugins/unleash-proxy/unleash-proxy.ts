import { NAIS_APP_NAME, NAIS_POD_NAME } from '@app/config/config';
import { isDeployed } from '@app/config/env';
import { withSpan } from '@app/helpers/tracing';
import { getLogger } from '@app/logger';
import { NAV_IDENT_PLUGIN_ID } from '@app/plugins/nav-ident';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';
import { Type } from 'typebox';

const log = getLogger('unleash-proxy-plugin');

export const unleashProxyPlugin = fastifyPlugin(
  async (app) => {
    app.withTypeProvider<TypeBoxTypeProvider>().get(
      '/feature-toggle/:toggle',
      {
        schema: {
          params: toggleParams,
          querystring: toggleQuerystring,
        },
      },
      async (req, reply) =>
        withSpan(
          'unleash.get_toggle',
          {
            toggle: req.params.toggle,
            nav_ident: req.navIdent,
            tab_id: req.tab_id ?? '',
            client_version: req.client_version ?? '',
          },
          async (span) => {
            const body = { navIdent: req.navIdent, appName: NAIS_APP_NAME, podName: NAIS_POD_NAME };

            const headers = new Headers({ 'content-type': 'application/json' });

            if (req.query.traceparent !== undefined) {
              headers.set('traceparent', req.query.traceparent);
            }

            const toggleResponse = await fetch(`${UNLEASH_PROXY_URL}/${req.params.toggle}`, {
              method: 'QUERY',
              headers,
              body: JSON.stringify(body),
            });

            span.setAttribute('http.status_code', toggleResponse.status);

            if (!toggleResponse.ok) {
              log.error({
                msg: 'Unleash proxy request failed',
                tab_id: req.tab_id,
                client_version: req.client_version,
                data: {
                  status: toggleResponse.status,
                  statusText: await toggleResponse.text(),
                  proxyVersion: toggleResponse.headers.get('App-Version'),
                },
              });

              return reply.status(502).send({ error: 'Failed to fetch feature toggle' });
            }

            const toggle = await toggleResponse.json();

            return reply.send(toggle);
          },
        ),
    );
  },
  { fastify: '5', name: 'unleash-proxy', dependencies: [NAV_IDENT_PLUGIN_ID] },
);

const toggleParams = Type.Object({ toggle: Type.String() });
const toggleQuerystring = Type.Object({ traceparent: Type.Optional(Type.String()) });

const UNLEASH_PROXY_URL = isDeployed
  ? 'http://klage-unleash-proxy/features'
  : 'https://kabin.intern.dev.nav.no/feature-toggle';
