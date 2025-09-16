import '@testing-library/jest-dom'
import EditControls from "@/components/home/EditControls";
import { fireEvent, render, screen } from "@testing-library/react";

test("no edit affordances on mobile; toast appears", () => {
  (global as any).innerWidth = 360;
  // Provide a matchMedia mock that matches mobile
  (global as any).window = (global as any).window || {};
  (global as any).window.matchMedia = (query: string) => ({
    matches: /max-width:\s*767px/.test(query),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as any);
  render(<EditControls />);
  const btn = screen.getByRole("button", { name: /editing unavailable on mobile/i });
  fireEvent.click(btn);
  expect(screen.getByText(/edit layout on tablet\/desktop/i)).toBeInTheDocument();
});


