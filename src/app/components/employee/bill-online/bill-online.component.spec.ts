import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOnlineComponent } from './bill-online.component';

describe('BillOnlineComponent', () => {
  let component: BillOnlineComponent;
  let fixture: ComponentFixture<BillOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillOnlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
