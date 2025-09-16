import '@testing-library/jest-dom'
import HomePage from "@/app/home/page";
import * as Copy from "@/copy/home";
import { render, screen } from "@testing-library/react";

test.each([
  ["training"], ["preparing"], ["conquer"],
] as const)("hero + helper switch by stage: %s", (stage) => {
  // Avoid network in this unit test by mocking fetch
  const mockRes = { id: 'default', widgets: [], sections: [] }
  vi.spyOn(global as any, 'fetch').mockResolvedValue(new Response(JSON.stringify(mockRes), { status: 200 }))
  vi.spyOn(Copy, "getCurrentStage").mockReturnValue(stage);
  render(<HomePage />);
  expect(screen.getByTestId("home-hero-title")).toHaveTextContent(Copy.hero[stage].title);
  expect(screen.getByTestId("home-hero-helper")).toHaveTextContent(Copy.helpers[stage].underHero);
});


