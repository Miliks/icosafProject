import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseDetailsComponent } from './use-case-details.component';

describe('UseCaseDetailsComponent', () => {
  let component: UseCaseDetailsComponent;
  let fixture: ComponentFixture<UseCaseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseCaseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
