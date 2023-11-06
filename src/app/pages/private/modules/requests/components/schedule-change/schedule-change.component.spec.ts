import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleChangeComponent } from './schedule-change.component';

describe('ScheduleChangeComponent', () => {
  let component: ScheduleChangeComponent;
  let fixture: ComponentFixture<ScheduleChangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleChangeComponent]
    });
    fixture = TestBed.createComponent(ScheduleChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
