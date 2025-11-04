import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffTable } from './diff-table';

describe('DiffTable', () => {
  let component: DiffTable;
  let fixture: ComponentFixture<DiffTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffTable],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffTable);
    component = fixture.componentInstance;
    component.formatEuro = value => value.toString();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
