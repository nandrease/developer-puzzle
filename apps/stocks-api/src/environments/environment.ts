// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { StocksAppConfig } from '@coding-challenge/stocks/data-access-app-config';

export const environment: StocksAppConfig = {
  production: false,
  apiKey: 'Tpk_44e13117a89a4629a3275847d95bc449',
  apiURL: 'https://sandbox.iexapis.com'
};