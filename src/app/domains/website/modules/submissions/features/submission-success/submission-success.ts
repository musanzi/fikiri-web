import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './submission-success.html'
})
export default class SubmissionSuccess {}
