import * as PriceDetails from "@/components/home/widgets/PriceLarge";

test("Charts are dynamically imported", () => {
  const src = PriceDetails.default?.toString() || "";
  // Accept either next/dynamic symbol or the compiled __vite_ssr_dynamic_import__ presence
  expect(/__vite_ssr_dynamic_import__|dynamic\(/.test(src)).toBe(true);
});


