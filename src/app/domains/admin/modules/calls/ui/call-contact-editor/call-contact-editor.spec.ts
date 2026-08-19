import { TestBed } from '@angular/core/testing';
import { ICallContactInfo } from '@/app/core/interfaces';
import { CallContactEditor } from './call-contact-editor';

describe('CallContactEditor', () => {
  const contactInfo = (): ICallContactInfo => ({
    name: 'Jane Doe',
    role: 'Responsable',
    email: 'jane@example.com',
    phone: '+243 000 000 000',
    links: []
  });

  it('adds and updates an additional contact', () => {
    const fixture = TestBed.createComponent(CallContactEditor);
    fixture.componentRef.setInput('value', contactInfo());

    fixture.componentInstance['addContact']();
    fixture.componentInstance['updateContact'](1, {
      name: 'John Doe',
      email: 'john@example.com'
    });

    expect(fixture.componentInstance.value().contacts).toEqual([
      { name: 'John Doe', role: '', email: 'john@example.com', phone: '' }
    ]);
  });

  it('promotes the next contact when the primary contact is deleted', () => {
    const fixture = TestBed.createComponent(CallContactEditor);
    fixture.componentRef.setInput('value', {
      ...contactInfo(),
      contacts: [{ name: 'John Doe', role: 'Assistant', email: 'john@example.com', phone: '' }]
    });

    fixture.componentInstance['deleteContact'](0);

    expect(fixture.componentInstance.value()).toEqual({
      name: 'John Doe',
      role: 'Assistant',
      email: 'john@example.com',
      phone: '',
      contacts: [],
      links: []
    });
  });
});
