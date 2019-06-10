import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DassCanvasComponent } from './dass-canvas.component';

describe('UiComponentComponent', () => {
  let component: DassCanvasComponent;
  let fixture: ComponentFixture<DassCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DassCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DassCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
