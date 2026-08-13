import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { sdgs } from '../../data/sdgs';

@Component({
  selector: 'app-sdgs',
  imports: [MatIconModule, NgOptimizedImage],
  templateUrl: './sdgs.html'
})
export class SdgsComponent {
  readonly sdgs = sdgs;
}
