import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { RunsPage } from "../pages/runs-page/RunsPage";

describe("RunsPage", () => {
  it("filters runs by status", async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText("Auth refactor");

    const group = screen.getByRole("group", { name: /Filter by status/i });
    await user.click(within(group).getByRole("button", { name: "Failed" }));

    expect(screen.queryByText("Auth refactor")).not.toBeInTheDocument();
    expect(screen.getByText("Migrate billing service")).toBeInTheDocument();
    expect(screen.getByText("Regenerate API docs")).toBeInTheDocument();
    expect(screen.queryByText("Fix checkout tests")).not.toBeInTheDocument();
  });

  it("searches by name and by repository", async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText("Auth refactor");

    const search = screen.getByLabelText(/Search runs/i);
    await user.type(search, "payments");

    expect(screen.getByText("Fix checkout tests")).toBeInTheDocument();
    expect(screen.queryByText("Auth refactor")).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "lint");

    expect(screen.getByText("Lint & format sweep")).toBeInTheDocument();
    expect(screen.queryByText("Fix checkout tests")).not.toBeInTheDocument();
  });

  it("opens run details with logs and closes them", async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await user.click(await screen.findByText("Auth refactor"));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Auth refactor")).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Cloning web-platform/),
    ).toBeInTheDocument();

    await user.click(
      within(dialog).getByRole("button", { name: /Close details/i }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
