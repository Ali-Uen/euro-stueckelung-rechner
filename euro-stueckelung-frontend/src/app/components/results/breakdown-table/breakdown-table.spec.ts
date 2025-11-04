import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownTable } from './breakdown-table';

describe('BreakdownTable', () => {
  let component: BreakdownTable;
  let fixture: ComponentFixture<BreakdownTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakdownTable],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreakdownTable);
    component = fixture.componentInstance;
    component.formatEuro = value => value.toString();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
