import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperModal } from './mat-basic.component';

describe('MatBasicComponent', () => {
  let component: DeveloperModal;
  let fixture: ComponentFixture<DeveloperModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeveloperModal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeveloperModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
