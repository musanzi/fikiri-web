import {
  booleanAttribute,
  Component,
  computed,
  input,
  InputSignal,
  InputSignalWithTransform,
  output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MESSAGE_STYLES } from '../../data';
import { IMessageType } from '../../interfaces';

@Component({
  selector: 'app-message',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './message.html',
  host: { class: 'block' }
})
export class Message {
  readonly type: InputSignal<IMessageType> = input<IMessageType>('error');
  readonly title: InputSignal<string> = input('');
  readonly message: InputSignal<string> = input.required<string>();
  readonly dismissible: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });
  readonly dismissed = output<void>();

  protected readonly styles = computed(() => MESSAGE_STYLES[this.type()]);
  protected readonly displayedTitle = computed(() => this.title() || this.styles().defaultTitle);
  protected readonly role = computed(() => (this.type() === 'error' ? 'alert' : 'status'));
  protected readonly ariaLive = computed(() => (this.type() === 'error' ? 'assertive' : 'polite'));
}
