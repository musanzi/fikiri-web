import { Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CallContactInfo, CallUsefulLink } from '../../interfaces/calls.interface';

@Component({
  selector: 'call-contact-editor',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatTooltipModule],
  templateUrl: './call-contact-editor.html'
})
export class CallContactEditor {
  readonly value = model.required<CallContactInfo>();

  protected updateContact(changes: Partial<CallContactInfo>): void {
    this.value.update((contact) => ({ ...contact, ...changes }));
  }

  protected addLink(): void {
    this.value.update((contact) => ({
      ...contact,
      links: [...contact.links, { label: '', url: '' }]
    }));
  }

  protected updateLink(index: number, changes: Partial<CallUsefulLink>): void {
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
