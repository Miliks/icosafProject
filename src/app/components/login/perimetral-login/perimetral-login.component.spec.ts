import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerimetralLoginComponent } from './perimetral-login.component';

describe('PerimetralLoginComponent', () => {
  let component: PerimetralLoginComponent;
  let fixture: ComponentFixture<PerimetralLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerimetralLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerimetralLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
