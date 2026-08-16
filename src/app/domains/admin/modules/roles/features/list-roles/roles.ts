import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IRole } from '@/app/core/interfaces';

@Component({
  imports: [DatePipe, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './roles.html'
})
export default class Roles {
  readonly displayedColumns = ['name', 'createdAt', 'updatedAt'];
  readonly rolesResource = httpResource<{ data: IRole[] }>(() => '/roles');
}
