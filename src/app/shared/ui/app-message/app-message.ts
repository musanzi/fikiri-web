import { booleanAttribute, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IMessageStyle, IMessageType } from '../../interfaces/message.interface';

const MESSAGE_STYLES: Record<IMessageType, IMessageStyle> = {
  success: {
    container:
      'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-50',
    iconContainer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
    message: 'text-emerald-800 dark:text-emerald-200',
    dismiss: 'text-emerald-700 dark:text-emerald-200',
    icon: 'circle-check',
    defaultTitle: 'Opération réussie'
  },
  error: {
    container: 'border-error-200 bg-error-50 text-error-950 dark:border-error-800 dark:bg-error-950 dark:text-error-50',
    iconContainer: 'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-200',
    message: 'text-error-800 dark:text-error-200',
    dismiss: 'text-error-700 dark:text-error-200',
    icon: 'circle-x',
    defaultTitle: 'Une erreur est survenue'
  },
  warning: {
    container: 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50',
    iconContainer: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
    message: 'text-amber-800 dark:text-amber-200',
    dismiss: 'text-amber-700 dark:text-amber-200',
    icon: 'triangle-alert',
    defaultTitle: 'Attention'
  }
};

@Component({
  selector: 'app-message',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './app-message.html',
  host: { class: 'block' }
})
export class Message {
  type = input<IMessageType>('error');
  title = input('');
  message = input.required<string>();
  dismissible = input(true, { transform: booleanAttribute });
  dismissed = output<void>();

  protected styles = computed(() => MESSAGE_STYLES[this.type()]);
  protected displayedTitle = computed(() => this.title() || this.styles().defaultTitle);
  protected role = computed(() => (this.type() === 'error' ? 'alert' : 'status'));
  protected ariaLive = computed(() => (this.type() === 'error' ? 'assertive' : 'polite'));
}
