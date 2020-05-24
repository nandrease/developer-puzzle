/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import * as Wreck from '@hapi/wreck';
import * as CatboxMemory from '@hapi/catbox-memory';
import { environment } from './environments/environment';

interface CacheKey {
  segment: string;
  id: string;
  symbol: string;
  period: string;
}

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    cache: [
      {
        name: 'stocks_cache',
        provider: {
          constructor: CatboxMemory,
          options: {
            partition: 'stocks_cached'
          }
        }
      }
    ]
  });

  const stocksCache = server.cache({
    cache: 'stocks_cache',
    segment: 'stocks',
    expiresIn: 1000 * 50,
    generateFunc: async ({ symbol, period }: CacheKey) => {
      const response = await Wreck.get(
        `${environment.apiURL}/beta/stock/${symbol}/chart/${period}?token=${environment.apiKey}`,
        { json: 'force' }
      );
      return response.payload;
    },
    generateTimeout: 2000
  });

  server.route({
    method: 'GET',
    path: '/api/stock/{symbol}/chart/{period}',
    handler: async (request, h) => {
      const cacheKey: CacheKey = {
        segment: 'stocks',
        id: request.params.symbol + '_' + request.params.period,
        symbol: request.params.symbol,
        period: request.params.period
      };

      return await stocksCache.get(cacheKey);
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
