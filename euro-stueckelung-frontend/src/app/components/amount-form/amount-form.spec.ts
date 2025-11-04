import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { AmountForm } from './amount-form';

describe('AmountForm', () => {
  let component: AmountForm;
  let fixture: ComponentFixture<AmountForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmountForm],
      providers: [FormBuilder],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmountForm);
    component = fixture.componentInstance;
    component.form = new FormBuilder().group({
      amount: [''],
    });
    component.currentMode = 'frontend';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
