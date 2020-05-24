import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  fromDate: Date;
  toDate: Date;

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group(
      {
        symbol: [ null, Validators.required ],
        // period: [ '3m', Validators.required ],
        fromDate: [ null, Validators.required ],
        toDate: [ null, Validators.required ]
      }
    );
  }

  fromDateFilter: (date: Date | null) => boolean = (date: Date | null) => {
    const now = new Date().getTime();
    const filteredDate = date.getTime();
    const toDate = this.stockPickerForm.value.toDate;
    if (toDate) {
      return filteredDate < toDate.getTime();
    }
    return filteredDate < now;
  };
  toDateFilter: (date: Date | null) => boolean = (date: Date | null) => {
    const now = new Date().getTime();
    const filteredDate = date.getTime();
    const fromDate = this.stockPickerForm.value.fromDate;
    if (fromDate) {
      return filteredDate > fromDate.getTime() && filteredDate < now;
    }
    return filteredDate < now;
  };

  ngOnInit() {
    this.stockPickerForm.valueChanges.subscribe(this.fetchQuote.bind(this));
  }

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, fromDate, toDate);
    }
  }
}
