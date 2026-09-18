"use client";

import type { ChangeEvent } from "react";

interface FilterBarProps {
  facility: string;
  month: string;
  onFacilityChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  months?: number[];
  hideMonth?: boolean;
}

export function FilterBar({
  facility,
  month,
  onFacilityChange,
  onMonthChange,
  months = [4, 5, 6, 7, 8, 9, 10, 11],
  hideMonth = false,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <label>
        <span>施設</span>
        <select value={facility} onChange={(e: ChangeEvent<HTMLSelectElement>) => onFacilityChange(e.target.value)}>
          <option value="all">全体</option>
          <option value="真駒内CC">真駒内CC</option>
          <option value="滝のCC">滝のCC</option>
          <option value="羊ヶ丘CC">羊ヶ丘CC</option>
        </select>
      </label>
      {!hideMonth ? (
        <label>
          <span>月</span>
          <select value={month} onChange={(e: ChangeEvent<HTMLSelectElement>) => onMonthChange(e.target.value)}>
            <option value="all">全期間</option>
            {months.map((item) => (
              <option key={item} value={String(item)}>{item}月</option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
