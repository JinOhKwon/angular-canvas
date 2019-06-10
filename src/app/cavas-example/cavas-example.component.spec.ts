import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CavasExampleComponent } from './cavas-example.component';

describe('CavasExampleComponent', () => {
  let component: CavasExampleComponent;
  let fixture: ComponentFixture<CavasExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CavasExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CavasExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
