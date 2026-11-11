import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { RunsPage } from "../pages/runs-page/RunsPage";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

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

    const params = new URLSearchParams(window.location.search);
    expect(params.get("status")).toBe("failed");
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

    const params = new URLSearchParams(window.location.search);
    expect(params.get("q")).toBe("lint");
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

  it("sorts runs by clicking the Created and Duration headers", async () => {
    const user = userEvent.setup();
    render(<RunsPage />);

    await screen.findByText("Auth refactor");

    const rowNames = () =>
      screen
        .getAllByRole("button", { name: /^Open details for run / })
        .map((el) => el.getAttribute("aria-label"));

    expect(rowNames()[0]).toBe("Open details for run Upgrade Node to 20");

    await user.click(screen.getByRole("button", { name: /Sort by Created/i }));
    expect(rowNames()[0]).toBe("Open details for run Lint & format sweep");

    await user.click(screen.getByRole("button", { name: /Sort by Created/i }));
    expect(rowNames()[0]).toBe("Open details for run Upgrade Node to 20");

    await user.click(screen.getByRole("button", { name: /Sort by Duration/i }));
    expect(rowNames()[0]).toBe("Open details for run Lint & format sweep");

    await user.click(screen.getByRole("button", { name: /Sort by Duration/i }));
    expect(rowNames()[0]).toBe("Open details for run Regenerate API docs");

    const params = new URLSearchParams(window.location.search);
    expect(params.get("sort")).toBe("durationSeconds");
    expect(params.get("dir")).toBe("asc");
  });

  it("applies filters from the URL on first load", async () => {
    window.history.replaceState(null, "", "/?status=failed&q=billing");

    render(<RunsPage />);

    await screen.findByText("Migrate billing service");
    expect(screen.queryByText("Auth refactor")).not.toBeInTheDocument();
    expect(screen.queryByText("Regenerate API docs")).not.toBeInTheDocument();
  });
});
