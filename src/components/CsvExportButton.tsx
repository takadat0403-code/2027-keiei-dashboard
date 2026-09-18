"use client";

import { serializeCsv, type CsvCell } from "@/lib/csv";

interface CsvExportButtonProps {
  filename: string;
  headers: string[];
  rows: CsvCell[][];
  label?: string;
}

export function CsvExportButton({
  filename,
  headers,
  rows,
  label = "CSV出力",
}: CsvExportButtonProps) {
  const download = () => {
    const csv = serializeCsv(headers, rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" className="secondary-button no-print" onClick={download}>
      {label}
    </button>
  );
}
