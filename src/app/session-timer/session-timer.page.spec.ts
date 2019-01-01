import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTimerPage } from './session-timer.page';

describe('SessionTimerPage', () => {
  let component: SessionTimerPage;
  let fixture: ComponentFixture<SessionTimerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionTimerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionTimerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
