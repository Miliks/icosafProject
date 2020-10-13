import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridListUCComponent } from './grid-list-uc.component';

describe('GridListUCComponent', () => {
  let component: GridListUCComponent;
  let fixture: ComponentFixture<GridListUCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridListUCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridListUCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
