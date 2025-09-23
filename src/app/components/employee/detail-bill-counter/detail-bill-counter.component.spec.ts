import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBillCounterComponent } from './detail-bill-counter.component';

describe('DetailBillCounterComponent', () => {
  let component: DetailBillCounterComponent;
  let fixture: ComponentFixture<DetailBillCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBillCounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBillCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
