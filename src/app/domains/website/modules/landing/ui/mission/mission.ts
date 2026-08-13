import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MISSIONS } from '../../data/mission';

@Component({
  selector: 'mission',
  imports: [MatIconModule],
  templateUrl: './mission.html'
})
export class MissionComponent {
  mission = MISSIONS;
}
