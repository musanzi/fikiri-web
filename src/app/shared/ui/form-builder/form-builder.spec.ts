import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { IField, IForm } from '@/app/core/interfaces/form.interface';
import { FormBuilder } from './form-builder';

describe('FormBuilder', () => {
  it('reorders questions in the selected section', () => {
    const fixture = TestBed.createComponent(FormBuilder);
    const sections: IForm[] = [
      {
        phase: 'Candidature',
        fields: [
          { type: 'text', name: 'first', label: 'Première question' },
          { type: 'text', name: 'second', label: 'Deuxième question' },
          { type: 'text', name: 'third', label: 'Troisième question' }
        ]
      }
    ];
    fixture.componentRef.setInput('value', sections);

    fixture.componentInstance['reorderQuestions'](0, {
      previousIndex: 2,
      currentIndex: 0
    } as CdkDragDrop<IField[]>);

    expect(fixture.componentInstance.value()[0].fields.map((field) => field.name)).toEqual([
      'third',
      'first',
      'second'
    ]);
    expect(sections[0].fields.map((field) => field.name)).toEqual(['first', 'second', 'third']);
  });
});
