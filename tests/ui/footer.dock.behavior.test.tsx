import { render } from "@testing-library/react";
import FooterDock from "@/components/layout/FooterDock";

vi.mock("@/components/ExperienceToggle", () => ({ default: (props: any) => <div data-testid="exp-pill" {...props} /> }));
vi.mock("@/components/ThemeToggle", () => ({ default: () => <button data-testid="theme-toggle" /> }));

test("footer dock mounts and has contentinfo role", () => {
  const { container } = render(<FooterDock />);
  const root = container.querySelector("div[role='contentinfo']");
  expect(root).toBeTruthy();
});


