import fastifyPlugin from 'fastify-plugin';

export const SERVE_ASSETS_PLUGIN_ID = 'serve-assets';

// Assets are served from CDN, not from the server.
export const serveAssetsPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.get('/assets/*', async (_, reply) => reply.code(404).send());
    pluginDone();
  },
  { fastify: '5', name: SERVE_ASSETS_PLUGIN_ID },
);
