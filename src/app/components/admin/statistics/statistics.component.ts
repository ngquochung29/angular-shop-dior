import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DeliveryRevenueResponse } from 'src/app/responses/delivery.revenue.response';
import { RoleCountResponse } from 'src/app/responses/role.count.response';
import { StatisticalService } from 'src/app/service/statistical.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
   years = [2023, 2024, 2025, 2026];
  selectedYear = new Date().getFullYear();

  loading = false;
  error: string | null = null;

  // doanh thu
  totals: number[] = Array.from({ length: 12 }, () => 0);
  cumTotals: number[] = [];
  maxValue = 1;
  totalYear = 0;
  totalThisMonth = 0;

  // roles
  userCount = 0;
  employeeCount = 0;
  totalUsers = 0;
  userPct = 0;
  employeePct = 0;

  readonly monthLabels = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
maxTotal: any;

  constructor(private stat: StatisticalService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  async loadAll(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      await Promise.all([ this.fetchRevenue(), this.fetchRoleCounts() ]);
    } catch (err) {
      console.error(err);
      this.error = 'Không tải được dữ liệu thống kê.';
    } finally {
      this.loading = false;
    }
  }

  // === gọi qua service ===
  private async fetchRevenue(): Promise<void> {
    const res: DeliveryRevenueResponse[] =
      await firstValueFrom(this.stat.revenueByMonth(this.selectedYear));

    const map = new Map<number, number>((res ?? []).map(r => [r.month, r.total ?? 0]));
    this.totals = Array.from({ length: 12 }, (_, i) => map.get(i + 1) ?? 0);

    this.maxValue = Math.max(1, ...this.totals);
    this.totalYear = this.totals.reduce((s, x) => s + x, 0);

    const idx = (this.selectedYear === new Date().getFullYear()) ? new Date().getMonth() : -1;
    this.totalThisMonth = idx >= 0 ? (this.totals[idx] ?? 0) : 0;

    this.buildCumTotals();
  }

  private async fetchRoleCounts(): Promise<void> {
    const rows: RoleCountResponse[] =
      await firstValueFrom(this.stat.userRoleCounts());

    const user = rows?.find(r => r.role === 'user')?.count ?? 0;
    const emp  = rows?.find(r => r.role === 'employee')?.count ?? 0;

    this.userCount = user;
    this.employeeCount = emp;
    this.totalUsers = user + emp;
    this.employeePct = this.totalUsers ? Math.round((emp * 100) / this.totalUsers) : 0;
    this.userPct = 100 - this.employeePct;
  }

  // === helpers ===
  private buildCumTotals(): void {
    let acc = 0;
    this.cumTotals = this.totals.map(v => (acc += (v || 0)));
  }

  widthPercent(v: number): string {
    const w = (v * 100) / this.maxValue;
    return (Number.isFinite(w) ? w : 0).toFixed(1) + '%';
    }

  money(n: number): string {
    return (n ?? 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
}