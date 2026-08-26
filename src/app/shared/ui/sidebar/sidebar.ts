import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navigation } from '../navigation/navigation';
import { User } from '../user/user';
import { INavigationItem } from '../../interfaces';

@Component({
  selector: 'sidebar',
  imports: [Navigation, User, RouterLink],
  host: {
    class: 'flex w-full flex-auto flex-col'
  },
  templateUrl: './sidebar.html'
})
export class Sidebar {
  readonly navigation = input.required<INavigationItem[]>();
  readonly profileRoute = input.required<string>();
}
