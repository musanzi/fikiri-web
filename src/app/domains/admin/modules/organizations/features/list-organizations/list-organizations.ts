import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IOrganization } from '@/app/shared/interfaces';
import { filter } from 'rxjs';
import { OrganizationsStore } from '../../data-access/organizations.store';
import { IOrganizationDialogData, IOrganizationDialogResult, IRemoveOrganizationDialogData } from '../../interfaces';
import { OrganizationFormDialog } from '../../ui/organization-form-dialog/organization-form-dialog';
import { RemoveOrganizationDialog } from '../../ui/remove-organization-dialog/remove-organization-dialog';

@Component({
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatIconModule, MatTableModule],
  templateUrl: './list-organizations.html',
  providers: [OrganizationsStore]
})
export default class ListOrganizations implements OnInit {
  protected readonly store = inject(OrganizationsStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly displayedColumns = ['name', 'createdAt', 'updatedAt', 'actions'];

  ngOnInit(): void {
    this.store.loadOrganizations();
  }

  protected openCreateDialog(): void {
    this.dialog
      .open<OrganizationFormDialog, IOrganizationDialogData, IOrganizationDialogResult>(OrganizationFormDialog, {
        data: {},
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IOrganizationDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.createOrganization(payload));
  }

  protected openUpdateDialog(organization: IOrganization): void {
    this.dialog
      .open<OrganizationFormDialog, IOrganizationDialogData, IOrganizationDialogResult>(OrganizationFormDialog, {
        data: { organization },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IOrganizationDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.updateOrganization({ id: organization.id, payload }));
  }

  protected openRemoveDialog(organization: IOrganization): void {
    this.dialog
      .open<RemoveOrganizationDialog, IRemoveOrganizationDialogData, boolean>(RemoveOrganizationDialog, {
        data: { organization },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeOrganization({ id: organization.id }));
  }
}
