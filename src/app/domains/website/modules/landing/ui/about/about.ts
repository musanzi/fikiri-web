import { Component } from '@angular/core';
import { ABOUT } from '../../data/about';

@Component({
  selector: 'app-about',
  templateUrl: './about.html'
})
export class AboutComponent {
  readonly aboutData = ABOUT;
}
