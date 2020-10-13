import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgvDetailsComponent } from './agv-details.component';

describe('AgvDetailsComponent', () => {
  let component: AgvDetailsComponent;
  let fixture: ComponentFixture<AgvDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgvDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
