import { ICallRequirement } from '@/app/shared/interfaces';
import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'call-requirements-editor',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatTooltipModule],
  templateUrl: './call-requirements-editor.html'
})
export class CallRequirementsEditor {
  readonly value = model.required<ICallRequirement[]>();

  protected addRequirement(): void {
    this.value.update((requirements) => [{ title: '', description: '' }, ...requirements]);
  }

  protected updateRequirement(index: number, changes: Partial<ICallRequirement>): void {
    this.value.update((requirements) =>
      requirements.map((requirement, requirementIndex) =>
        requirementIndex === index ? { ...requirement, ...changes } : requirement
      )
    );
  }

  protected deleteRequirement(index: number): void {
    this.value.update((requirements) => requirements.filter((_, requirementIndex) => requirementIndex !== index));
  }
}
