import { Component, HostListener, OnInit } from '@angular/core';

const STORAGE_KEY = 'promo_modal_last_shown';   // khoá lưu trạng thái
const MINUTES_COOLDOWN = 5;                     // sau 5p mới hiện lại
@Component({
  selector: 'app-promo-modal',
  templateUrl: './promo-modal.component.html',
  styleUrls: ['./promo-modal.component.scss']
})
export class PromoModalComponent implements OnInit {
 isOpen = false;

  ngOnInit(): void {
    const last = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    const cooldownMs = MINUTES_COOLDOWN * 60 * 1000;

    if (!last || now - Number(last) > cooldownMs) {
      setTimeout(() => this.open(), 800);
    }
  }

  open(): void {
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // khoá scroll nền
  }

  close(): void {
    this.isOpen = false;
    localStorage.setItem(STORAGE_KEY, String(Date.now())); // lưu thời điểm đóng
    document.body.style.overflow = ''; // trả scroll
  }

  // Đóng khi nhấn ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isOpen) this.close();
  }

  // Đóng khi click nền mờ
  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('popup-backdrop')) {
      this.close();
    }
  }
}
