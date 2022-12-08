import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionComponent } from './mission.component';

describe('MissionComponent', () => {
  let component: MissionComponent;
  let fixture: ComponentFixture<MissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
