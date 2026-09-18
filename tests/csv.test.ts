import { describe, expect, it } from "vitest";
import { serializeCsv } from "../src/lib/csv";

describe("CSV serialization", () => {
  it("adds an Excel-friendly UTF-8 BOM", () => {
    const csv = serializeCsv(["項目"], [["値"]]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
  });

  it("escapes commas, quotes and line breaks", () => {
    const csv = serializeCsv(["a", "b"], [["x,y", 'a"b'], ["line\nbreak", null]]);
    expect(csv).toContain('"x,y"');
    expect(csv).toContain('"a""b"');
    expect(csv).toContain('"line\nbreak",');
  });

  it("serializes null and undefined as blank cells", () => {
    const csv = serializeCsv(["a", "b"], [[null, undefined]]);
    expect(csv).toContain("\r\n,\r\n");
  });
});
