import { DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from 'ng-apexcharts';
import { LIFECYCLE_LABELS } from '../data';
import { IAdminStats, ICallLifecycle } from '../interfaces';

@Component({
  templateUrl: './stats.html',
  imports: [
    ChartComponent,
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule
  ]
})
export default class Stats {
  protected readonly statsResource = httpResource<{ data: IAdminStats }>(() => '/stats/admin-stats');
  protected readonly topCallsColumns = ['name', 'lifecycle', 'submissions', 'awards'];

  protected readonly summary = computed(() => {
    if (!this.statsResource.hasValue()) {
      return [];
    }

    const stats = this.statsResource.value().data;

    return [
      {
        title: 'Appels',
        description: `${stats.overview.calls.published} publiés · ${stats.overview.calls.unpublished} non publiés`,
        icon: 'megaphone',
        value: stats.overview.calls.total,
        growth: stats.growth.call.percentageChange
      },
      {
        title: 'Solutions',
        description: `${stats.overview.solutions.awarded} récompensées`,
        icon: 'lightbulb',
        value: stats.overview.solutions.total,
        growth: stats.growth.solution.percentageChange
      },
      {
        title: 'Utilisateurs',
        description: 'Utilisateurs enregistrés',
        icon: 'users',
        value: stats.overview.users.total,
        growth: stats.growth.user.percentageChange
      }
    ];
  });

  protected readonly monthlySeries = computed<ApexAxisChartSeries>(() => {
    const monthly = this.statsResource.hasValue() ? this.statsResource.value().data.trends.monthly : [];

    return [
      { name: 'Appels', data: monthly.map(({ calls }) => calls) },
      { name: 'Solutions', data: monthly.map(({ solutions }) => solutions) },
      { name: 'Utilisateurs', data: monthly.map(({ users }) => users) }
    ];
  });

  protected readonly monthlyXAxis = computed<ApexXAxis>(() => ({
    categories: this.statsResource.hasValue()
      ? this.statsResource.value().data.trends.monthly.map(({ label }) => label)
      : [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: 'var(--color-neutral-500)' } }
  }));

  protected readonly callsBreakdownSeries = computed<ApexNonAxisChartSeries>(() =>
    this.statsResource.hasValue()
      ? this.statsResource.value().data.breakdowns.callsByLifecycle.map(({ count }) => count)
      : []
  );

  protected readonly callsBreakdownLabels = computed(() =>
    this.statsResource.hasValue()
      ? this.statsResource.value().data.breakdowns.callsByLifecycle.map(({ label }) => label)
      : []
  );

  protected readonly solutionsBreakdownSeries = computed<ApexNonAxisChartSeries>(() =>
    this.statsResource.hasValue()
      ? this.statsResource.value().data.breakdowns.solutionsByStatus.map(({ count }) => count)
      : []
  );

  protected readonly solutionsBreakdownLabels = computed(() =>
    this.statsResource.hasValue()
      ? this.statsResource.value().data.breakdowns.solutionsByStatus.map(({ label }) => label)
      : []
  );

  protected readonly lineChart: ApexChart = {
    type: 'line',
    height: 320,
    fontFamily: 'inherit',
    toolbar: { show: false },
    zoom: { enabled: false }
  };
  protected readonly donutChart: ApexChart = {
    type: 'donut',
    height: 290,
    fontFamily: 'inherit'
  };
  protected readonly chartColors = [
    'var(--color-primary-600)',
    'var(--color-amber-500)',
    'var(--color-emerald-500)',
    'var(--color-violet-500)'
  ];
  protected readonly lineStroke: ApexStroke = { curve: 'smooth', width: 3 };
  protected readonly chartDataLabels: ApexDataLabels = { enabled: false };
  protected readonly chartFill: ApexFill = { type: 'solid', opacity: 1 };
  protected readonly chartGrid: ApexGrid = {
    borderColor: 'var(--color-neutral-200)',
    strokeDashArray: 4,
    xaxis: { lines: { show: false } }
  };
  protected readonly chartLegend: ApexLegend = {
    position: 'bottom',
    fontFamily: 'inherit',
    labels: { colors: 'var(--color-neutral-600)' }
  };
  protected readonly chartYAxis: ApexYAxis = {
    min: 0,
    forceNiceScale: true,
    labels: {
      formatter: (value) => Math.round(value).toLocaleString('fr-FR'),
      style: { colors: ['var(--color-neutral-500)'] }
    }
  };
  protected readonly chartTooltip: ApexTooltip = {
    y: { formatter: (value) => value.toLocaleString('fr-FR') }
  };
  protected readonly donutPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: { show: true, label: 'Total' }
        }
      }
    }
  };

  protected growthIcon(change: number | null): string {
    if (change === null || change === 0) {
      return 'minus';
    }

    return change > 0 ? 'trending-up' : 'trending-down';
  }

  protected lifecycleLabel(lifecycle: ICallLifecycle): string {
    return LIFECYCLE_LABELS[lifecycle];
  }
}
