// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { SearchBox } from "@/components/search-box";
import { getLearningItems } from "@/lib/data";
import { searchLearningItems, type SearchResult } from "@/lib/search";

/**
 * SearchBox is the most logic-dense component in the app and implements a full
 * ARIA combobox by hand: aria-expanded, aria-controls, aria-activedescendant,
 * roving selection, and Arrow/Enter/Escape handling. None of that was covered by
 * a test, so any refactor could quietly break keyboard and screen-reader use
 * while looking perfect to a mouse.
 *
 * Suggestions come from the real search over the real catalog rather than
 * hand-built fixtures, so these cannot drift from the actual SearchResult shape.
 */

const suggestions: SearchResult[] = searchLearningItems(getLearningItems(), "housing").slice(0, 3);

/** The real component is controlled; this mirrors how the app drives it. */
function Harness({
  initial = "",
  results = suggestions,
  onSelect,
}: {
  initial?: string;
  results?: SearchResult[];
  onSelect?: (result: SearchResult) => void;
}) {
  const [value, setValue] = useState(initial);
  return <SearchBox value={value} onChange={setValue} suggestions={results} onSelect={onSelect} />;
}

function combobox() {
  return screen.getByRole("combobox");
}

test("catalog has enough housing matches for these tests to be meaningful", () => {
  // Guards the fixtures above: if the catalog changes so that "housing" returns
  // nothing, the keyboard tests below would silently pass against an empty list.
  expect(suggestions.length).toBeGreaterThanOrEqual(2);
});

test("exposes an accessibly labelled combobox", () => {
  render(<Harness />);
  const input = combobox();
  expect(input).toHaveAccessibleName("Search courses, modules, paths, or topics");
  expect(input).toHaveAttribute("aria-autocomplete", "list");
});

test("keeps the listbox closed until there is a query", async () => {
  const user = userEvent.setup();
  render(<Harness />);

  await user.click(combobox());
  // Focused but empty: nothing to suggest, so it must not claim to be expanded.
  expect(combobox()).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

  await user.type(combobox(), "housing");
  expect(combobox()).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("listbox")).toBeInTheDocument();
});

test("aria-controls points at the listbox that actually renders", async () => {
  const user = userEvent.setup();
  render(<Harness initial="housing" />);
  await user.click(combobox());

  const listboxId = combobox().getAttribute("aria-controls");
  expect(listboxId).toBeTruthy();
  expect(screen.getByRole("listbox")).toHaveAttribute("id", listboxId as string);
});

test("ArrowDown walks the options and tracks aria-activedescendant", async () => {
  const user = userEvent.setup();
  render(<Harness initial="housing" />);
  const input = combobox();
  await user.click(input);

  const options = screen.getAllByRole("option");
  // First option is active on open.
  expect(options[0]).toHaveAttribute("aria-selected", "true");
  expect(input.getAttribute("aria-activedescendant")).toBe(options[0].id);

  await user.keyboard("{ArrowDown}");
  expect(screen.getAllByRole("option")[1]).toHaveAttribute("aria-selected", "true");
  expect(input.getAttribute("aria-activedescendant")).toBe(screen.getAllByRole("option")[1].id);
});

test("ArrowUp stops at the first option instead of wrapping past it", async () => {
  const user = userEvent.setup();
  render(<Harness initial="housing" />);
  await user.click(combobox());

  await user.keyboard("{ArrowUp}{ArrowUp}");
  expect(screen.getAllByRole("option")[0]).toHaveAttribute("aria-selected", "true");
});

test("ArrowDown clamps at the last option", async () => {
  const user = userEvent.setup();
  render(<Harness initial="housing" />);
  await user.click(combobox());

  const count = screen.getAllByRole("option").length;
  await user.keyboard("{ArrowDown}".repeat(count + 3));
  const options = screen.getAllByRole("option");
  expect(options[options.length - 1]).toHaveAttribute("aria-selected", "true");
});

test("Enter selects the active option and reports it upward", async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<Harness initial="housing" onSelect={onSelect} />);
  await user.click(combobox());

  await user.keyboard("{ArrowDown}{Enter}");

  expect(onSelect).toHaveBeenCalledTimes(1);
  const selected = onSelect.mock.calls[0][0] as SearchResult;
  expect(selected).toBe(suggestions[1]);
  // Selecting also writes the title back into the field.
  expect(combobox()).toHaveValue(selected.item.title);
});

test("clicking an option selects it", async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<Harness initial="housing" onSelect={onSelect} />);
  await user.click(combobox());

  await user.click(screen.getAllByRole("option")[0]);

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect.mock.calls[0][0]).toBe(suggestions[0]);
});

test("Escape closes the listbox without clearing the query", async () => {
  const user = userEvent.setup();
  render(<Harness initial="housing" />);
  await user.click(combobox());
  expect(screen.getByRole("listbox")).toBeInTheDocument();

  await user.keyboard("{Escape}");

  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  expect(combobox()).toHaveValue("housing");
});

test("offers recovery suggestions when nothing matches", async () => {
  const user = userEvent.setup();
  render(<Harness initial="zzzznotathing" results={[]} />);
  await user.click(combobox());

  expect(screen.getByRole("listbox")).toBeInTheDocument();
  expect(screen.getByText(/No matches/i)).toBeVisible();
});

test("Enter is inert when there is nothing to select", async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<Harness initial="zzzznotathing" results={[]} onSelect={onSelect} />);
  await user.click(combobox());

  await user.keyboard("{Enter}");

  expect(onSelect).not.toHaveBeenCalled();
});
