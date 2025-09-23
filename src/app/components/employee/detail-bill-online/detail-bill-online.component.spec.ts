import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBillOnlineComponent } from './detail-bill-online.component';

describe('DetailBillOnlineComponent', () => {
  let component: DetailBillOnlineComponent;
  let fixture: ComponentFixture<DetailBillOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBillOnlineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBillOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
