import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPanel } from './status-panel';

describe('StatusPanel', () => {
  let component: StatusPanel;
  let fixture: ComponentFixture<StatusPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
