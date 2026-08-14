import { Component } from '@angular/core';
import { HeroComponent } from '../ui/hero/hero';
import { SdgsComponent } from '../ui/sdgs/sdgs';
import { AboutComponent } from '../ui/about/about';
import { MissionComponent } from '../ui/mission/mission';
import { Awards } from '../ui/awards/awards';

@Component({
  imports: [HeroComponent, SdgsComponent, AboutComponent, MissionComponent, Awards],
  templateUrl: './landing.html'
})
export default class Landing {}
