import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTimesheetModal } from './add-timesheet-modal';

describe('AddTimesheetModal', () => {
  let component: AddTimesheetModal;
  let fixture: ComponentFixture<AddTimesheetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTimesheetModal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTimesheetModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
