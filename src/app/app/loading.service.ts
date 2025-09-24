import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private requestCount = 0;

  constructor(private spinner: NgxSpinnerService) {}

  show() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.spinner.show();
    }
  }

  hide() {
    this.requestCount = Math.max(this.requestCount - 1, 0);
    if (this.requestCount === 0) {
      this.spinner.hide();
    }
  }
}
