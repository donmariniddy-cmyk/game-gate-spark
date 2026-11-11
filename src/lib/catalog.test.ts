import { describe, expect, it } from "vitest";
import { libraryGrant, publicGames, type CatalogGame } from "./catalog";
const row = (slug: string, kind: string, is_active: boolean, sort_order: number) => ({ slug, title: slug, kind, is_active, sort_order } as CatalogGame);
describe("library rules", () => {
  it("excludes hidden games", () => expect(publicGames([row("hidden", "offline", false, 0)], "offline")).toEqual([]));
  it("keeps browser and offline games separate", () => expect(publicGames([row("snake", "offline", true, 0), row("sudoku", "browser", true, 1)], "browser").map(g => g.slug)).toEqual(["sudoku"]));
  it("respects catalog order", () => expect(publicGames([row("b", "offline", true, 2), row("a", "offline", true, 1)], "offline").map(g => g.slug)).toEqual(["a", "b"]));
  it("one permission grants the entire library", () => expect(libraryGrant(" Player@Example.com ", "owner")).toEqual({ user_email: "player@example.com", game_slug: "all-games", granted_by: "owner" }));
});