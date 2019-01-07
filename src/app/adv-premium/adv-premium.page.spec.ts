import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvPremiumPage } from './adv-premium.page';

describe('AdvPremiumPage', () => {
  let component: AdvPremiumPage;
  let fixture: ComponentFixture<AdvPremiumPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvPremiumPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvPremiumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
