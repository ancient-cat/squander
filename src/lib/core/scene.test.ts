import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  ticker: {
    add: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("./app.js", () => ({
  app: { ticker: mocks.ticker },
  is_ready: vi.fn(),
}));

import { initialized_scenes, Scenes, type Scene } from "./scene.js";

describe("Scenes", () => {
  beforeAll(async () => {
    await Scenes.init();
  });

  beforeEach(async () => {
    while (Scenes.current() !== undefined) {
      await Scenes.pop();
    }
    initialized_scenes.clear();
    vi.clearAllMocks();
  });

  it("initializes, enters, updates, cleans up, and exits scenes in order", async () => {
    const events: string[] = [];
    const first: Scene = {
      name: "first",
      init: () => {
        events.push("first:init");
      },
      enter: () => {
        events.push("first:enter");
        return () => events.push("first:cleanup");
      },
      exit: () => {
        events.push("first:exit");
      },
      update: vi.fn(),
    };
    const second: Scene = {
      name: "second",
      enter: () => {
        events.push("second:enter");
      },
      update: vi.fn(),
    };

    await Scenes.switch(first);
    await Scenes.switch(second);

    expect(events).toEqual(["first:init", "first:enter", "first:cleanup", "first:exit", "second:enter"]);
    expect(mocks.ticker.add).toHaveBeenNthCalledWith(1, first.update);
    expect(mocks.ticker.remove).toHaveBeenCalledWith(first.update);
    expect(mocks.ticker.add).toHaveBeenNthCalledWith(2, second.update);
    expect(Scenes.current()).toBe(second);
  });

  it("initializes a scene only once when it is re-entered", async () => {
    const scene: Scene = { name: "reused", init: vi.fn(), update: vi.fn() };

    await Scenes.push(scene);
    await Scenes.pop();
    await Scenes.push(scene);

    expect(scene.init).toHaveBeenCalledTimes(1);
  });

  it("keeps the underlying scene active when pushing a scene", async () => {
    const underlying: Scene = { name: "underlying", update: vi.fn() };
    const overlay: Scene = { name: "overlay", update: vi.fn() };

    await Scenes.push(underlying);
    await Scenes.push(overlay);

    expect(Scenes.get_scenes()).toEqual([underlying, overlay]);
    expect(mocks.ticker.remove).not.toHaveBeenCalledWith(underlying.update);

    await Scenes.pop();
    expect(Scenes.current()).toBe(underlying);
    expect(mocks.ticker.remove).toHaveBeenCalledWith(overlay.update);
  });
});
