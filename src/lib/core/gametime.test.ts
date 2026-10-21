import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GameTimer } from "./gametime.js";

describe("GameTime", () => {
  let game_time: GameTimer;

  beforeEach(async () => {
    vi.resetModules();
    ({ GameTime: game_time } = await import("./gametime.js"));
  });

  it("tracks millisecond updates as elapsed seconds", () => {
    game_time.update(250);
    game_time.update(750);

    expect(game_time.get_ticks()).toBe(2);
    expect(game_time.get_elapsed()).toBe(1);
  });

  it("resolves waits after enough game time has elapsed", async () => {
    const finished = vi.fn();
    const waiting = game_time.wait(250).then(finished);

    game_time.update(100);
    game_time.update(100);
    await Promise.resolve();
    expect(finished).not.toHaveBeenCalled();

    game_time.update(50);
    await waiting;
    expect(finished).toHaveBeenCalledTimes(1);
  });

  it("throttles callbacks using elapsed seconds", () => {
    const callback = vi.fn((value: string) => value.toUpperCase());
    const throttled = game_time.create_throttle(1, callback);

    game_time.update(999);
    expect(throttled("early")).toEqual([false]);

    game_time.update(1);
    expect(throttled("ready")).toEqual([true, "READY"]);
    expect(callback).toHaveBeenCalledOnce();
  });

  it("runs and cancels game-time intervals", () => {
    const callback = vi.fn();
    const cancel = game_time.create_interval(0.5, callback);

    for (let tick = 0; tick < 6; tick += 1) {
      game_time.update(200);
    }
    expect(callback).toHaveBeenCalledTimes(2);

    cancel();
    for (let tick = 0; tick < 3; tick += 1) {
      game_time.update(200);
    }
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
