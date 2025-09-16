import { render, screen } from "@testing-library/react";
import Widget from "@/components/home/Widget";

test("widget header hidden by default", () => {
  render(<Widget title="Hidden Header"><div>Body</div></Widget>);
  expect(screen.queryByText("Hidden Header")).toBeNull();
});


