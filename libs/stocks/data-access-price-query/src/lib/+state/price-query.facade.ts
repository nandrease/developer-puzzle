import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchPriceQuery } from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { getSelectedSymbol, getAllPriceQueries } from './price-query.selectors';
import { map, skip } from 'rxjs/operators';

@Injectable()
export class PriceQueryFacade {
  selectedSymbol$ = this.store.pipe(select(getSelectedSymbol));
  priceQueries$ = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(priceQueries =>
      priceQueries.map(priceQuery => [priceQuery.date, priceQuery.close])
    )
  );

  constructor(private store: Store<PriceQueryPartialState>) {}

  fetchQuote(symbol: string, fromDate: Date, toDate: Date) {
    const period = this.fetchPeriodFromNow(fromDate);
    this.store.dispatch(new FetchPriceQuery(symbol, period));
  }

  fetchPeriodFromNow(fromDate: Date): string {
    // Need to fetch data from 'fromDate' to today
    const start = fromDate.getTime();
    const now = new Date().getTime();
    const dayInMilliSeconds = 1000 * 3600 * 24;
    const period = (now - start) / dayInMilliSeconds;
    if (period / 365 > 1) {
      return Math.ceil(period / 365) + 'y';
    } else if (period / 30 > 1) {
      return Math.ceil(period / 30) + 'm';
    } else if (period / 7 > 1) {
      return Math.ceil(period / 7) + 'w';
    } else {
      return Math.ceil(period) + 'd';
    }
  }
}
