import { describe, expect, it, vi } from "vitest";
import { create_derived, create_readonly, create_writable } from "./stores.js";

describe("observable stores", () => {
  it("starts with the first subscriber and stops with the last", () => {
    const stop = vi.fn();
    const start = vi.fn(() => stop);
    const store = create_writable(1, start);
    const first = vi.fn();
    const second = vi.fn();

    const unsubscribe_first = store.subscribe(first);
    const unsubscribe_second = store.subscribe(second);
    store.set(2);
    store.set(2);
    store.update((value) => value + 1);

    expect(start).toHaveBeenCalledTimes(1);
    expect(first.mock.calls).toEqual([[1], [2], [3]]);
    expect(second.mock.calls).toEqual([[1], [2], [3]]);

    unsubscribe_first();
    expect(stop).not.toHaveBeenCalled();
    unsubscribe_second();
    expect(stop).toHaveBeenCalledTimes(1);
  });

  it("derives values from multiple stores", () => {
    const left = create_writable(2);
    const right = create_writable(3);
    const total = create_derived([left, right], ([a, b]) => a + b);
    const listener = vi.fn();
    const unsubscribe = total.subscribe(listener);

    left.set(4);
    right.set(6);
    unsubscribe();
    left.set(10);

    expect(total.get()).toBe(10);
    expect(listener.mock.calls).toEqual([[5], [7], [10]]);

    const unsubscribe_again = total.subscribe(listener);
    expect(total.get()).toBe(16);
    unsubscribe_again();
  });

  it("exposes a read-only view without copying state", () => {
    const writable = create_writable("before");
    const readable = create_readonly(writable);

    writable.set("after");

    expect(readable.get()).toBe("after");
    expect(readable).not.toHaveProperty("set");
  });
});
