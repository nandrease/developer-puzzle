import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';

type ChartData = (string | number)[][];

interface Chart {
  title: string;
  type: string;
  data: ChartData;
  columnNames: string[];
  options: {
    title: string;
    width: string;
    height: string;
  };
}

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data$: Observable<ChartData>;

  chart: Chart;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };

    this.data$.subscribe(newData => (this.chart.data = newData));
  }
}
