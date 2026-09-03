import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { IRemoveSolutionDialogData } from '../../interfaces';

@Component({
  selector: 'app-remove-solution-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './remove-solution-dialog.html'
})
export class RemoveSolutionDialog {
  protected readonly data = inject<IRemoveSolutionDialogData>(MAT_DIALOG_DATA);
}
