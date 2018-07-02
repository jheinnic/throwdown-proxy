import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRandomArtComponent } from './ngx-random-art.component';

describe('NgxRandomArtComponent', () => {
  let component: NgxRandomArtComponent;
  let fixture: ComponentFixture<NgxRandomArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxRandomArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxRandomArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
