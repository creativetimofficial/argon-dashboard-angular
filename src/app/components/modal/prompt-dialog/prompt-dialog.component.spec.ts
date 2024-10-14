import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptDialogComponent } from './prompt-dialog.component';

describe('PromptDialogComponent', () => {
  let component: PromptDialogComponent;
  let fixture: ComponentFixture<PromptDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
