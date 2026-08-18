import { ICallContactInfo } from '@/app/core/interfaces';
import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'call-contact-editor',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatTooltipModule],
  templateUrl: './call-contact-editor.html'
})
export class CallContactEditor {
  readonly value = model.required<ICallContactInfo>();

  protected updateContact(changes: Partial<ICallContactInfo>): void {
    this.value.update((contact) => ({ ...contact, ...changes }));
  }

  protected addLink(): void {
    this.value.update((contact) => ({
      ...contact,
      links: [...contact.links, { label: '', url: '' }]
    }));
  }

  protected updateLink(index: number, changes: Partial<ICallContactInfo['links'][number]>): void {
    this.value.update((contact) => ({
      ...contact,
      links: contact.links.map((link, linkIndex) => (linkIndex === index ? { ...link, ...changes } : link))
    }));
  }

  protected deleteLink(index: number): void {
    this.value.update((contact) => ({
      ...contact,
      links: contact.links.filter((_, linkIndex) => linkIndex !== index)
    }));
  }
}
