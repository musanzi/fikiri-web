import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IAdminStats, ISummaryItem } from '../interfaces/stats.interface';

@Component({
  templateUrl: './stats.html',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatIconModule]
})
export default class Stats {
  readonly statsResource = httpResource<{ data: IAdminStats }>(() => '/stats/admin-stats');

  readonly summary = computed<ISummaryItem[]>(() => {
    if (!this.statsResource.hasValue()) {
      return [];
    }

    const stats = this.statsResource.value().data;

    return [
      {
        title: 'Appels',
        description: 'Nombre total des appels',
        icon: 'megaphone',
        value: stats.calls
      },
      {
        title: 'Appels publiés',
        description: 'Appels actuellement publiés',
        icon: 'circle-check-big',
        value: stats.publishedCalls
      },
      {
        title: 'Appels non publiés',
        description: 'Appels en attente de publication',
        icon: 'circle-dashed',
        value: stats.unpublishedCalls
      },
      {
        title: 'Solutions',
        description: 'Solutions proposées',
        icon: 'lightbulb',
        value: stats.solutions
      },
      {
        title: 'Utilisateurs',
        description: 'Utilisateurs enregistrés',
        icon: 'users',
        value: stats.users
      }
    ];
  });
}
