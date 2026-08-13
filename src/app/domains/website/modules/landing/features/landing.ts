import { Component } from '@angular/core';
import { HeroComponent } from '../ui/hero/hero';
import { SdgsComponent } from '../ui/sdgs/sdgs';
import { AboutComponent } from '../ui/about/about';
import { MissionComponent } from '../ui/mission/mission';
import { SolutionsAwards } from '../ui/solutions/solutions';

@Component({
  imports: [HeroComponent, SdgsComponent, AboutComponent, MissionComponent, SolutionsAwards],
  templateUrl: './landing.html'
})
export class LandingComponent {}
