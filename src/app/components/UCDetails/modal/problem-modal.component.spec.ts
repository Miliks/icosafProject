import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemModalComponent } from './problem-modal.component';

describe('ProblemModalComponent', () => {
  let component: ProblemModalComponent;
  let fixture: ComponentFixture<ProblemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
