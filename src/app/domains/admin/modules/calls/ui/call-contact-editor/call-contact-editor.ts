import { ICallContact, ICallContactInfo } from '@/app/shared/interfaces';
import { Component, computed, model } from '@angular/core';
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

  protected readonly contacts = computed<ICallContact[]>(() => {
    const contact = this.value();
    return [this.primaryContact(contact), ...(contact.contacts ?? [])];
  });

  protected addContact(): void {
    this.value.update((contact) => ({
      ...contact,
      contacts: [...(contact.contacts ?? []), this.emptyContact()]
    }));
  }

  protected updateContact(index: number, changes: Partial<ICallContact>): void {
    this.value.update((contact) => {
      if (index === 0) {
        return { ...contact, ...changes };
      }

      return {
        ...contact,
        contacts: (contact.contacts ?? []).map((item, contactIndex) =>
          contactIndex === index - 1 ? { ...item, ...changes } : item
        )
      };
    });
  }

  protected deleteContact(index: number): void {
    this.value.update((contactInfo) => {
      const contacts = [this.primaryContact(contactInfo), ...(contactInfo.contacts ?? [])].filter(
        (_, contactIndex) => contactIndex !== index
      );
      const [primary = this.emptyContact(), ...additionalContacts] = contacts;

      return {
        ...contactInfo,
        ...primary,
        contacts: additionalContacts
      };
    });
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

  private emptyContact(): ICallContact {
    return { name: '', role: '', email: '', phone: '' };
  }

  private primaryContact(contact: ICallContactInfo): ICallContact {
    return {
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone
    };
  }
}
