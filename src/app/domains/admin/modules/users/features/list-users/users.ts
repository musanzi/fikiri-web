import { DatePipe } from '@angular/common';
import { Component, computed, debounced, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '@/app/shared/ui/message/message';
import { filter } from 'rxjs';
import { UsersStore } from '../../data-access/users.store';
import {
  IQueryParams,
  IRemoveUserDialogData,
  IUserDialogData,
  IUserDialogResult,
  IUserRow
} from '../../interfaces/users.interface';
import { RemoveUserDialog } from '../../ui/remove-user-dialog/remove-user-dialog';
import { UserFormDialog } from '../../ui/user-form-dialog/user-form-dialog';

@Component({
  imports: [
    DatePipe,
    FormsModule,
    Message,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './users.html',
  providers: [UsersStore]
})
export default class Users implements OnInit {
  protected readonly store = inject(UsersStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly page = signal<number>(this.initialPage());
  protected readonly q = signal<string>(this.route.snapshot.queryParamMap.get('q') ?? '');
  protected readonly debouncedQuery = debounced(this.q, 300);
  protected readonly displayedColumns = ['name', 'email', 'phoneNumber', 'roles', 'createdAt', 'actions'];

  private readonly queryParams = computed<IQueryParams>(() => ({
    page: this.page(),
    q: this.debouncedQuery.value()
  }));

  private readonly loadUsersEffect = effect(() => this.store.loadUsers(this.queryParams()));

  ngOnInit(): void {
    this.store.loadLookups();
  }

  protected onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.persistFilters();
  }

  protected onQueryChange(query: string): void {
    this.q.set(query);
    this.page.set(1);
    this.persistFilters();
  }

  protected openCreateDialog(): void {
    this.dialog
      .open<UserFormDialog, IUserDialogData, IUserDialogResult>(UserFormDialog, {
        data: { organizations: this.store.organizations(), roles: this.store.roles() },
        maxWidth: '95vw',
        width: '48rem'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IUserDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.createUser(payload));
  }

  protected openUpdateDialog(user: IUserRow): void {
    this.dialog
      .open<UserFormDialog, IUserDialogData, IUserDialogResult>(UserFormDialog, {
        data: { organizations: this.store.organizations(), roles: this.store.roles(), user },
        maxWidth: '95vw',
        width: '48rem'
      })
      .afterClosed()
      .pipe(
        filter((result): result is IUserDialogResult => result !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ payload }) => this.store.updateUser({ id: user.id, payload }));
  }

  protected openRemoveDialog(user: IUserRow): void {
    this.dialog
      .open<RemoveUserDialog, IRemoveUserDialogData, boolean>(RemoveUserDialog, {
        data: { user },
        width: '28rem'
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed === true),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.store.removeUser({ id: user.id }));
  }

  private initialPage(): number {
    const page = Number(this.route.snapshot.queryParamMap.get('page'));
    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  private persistFilters(): void {
    const page = this.page();

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page === 1 ? null : page,
        q: this.q() || null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
