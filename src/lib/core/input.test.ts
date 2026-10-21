import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { create_input_map, create_keyboard_listener } from "./input.js";

const keyboard_event = (type: "keydown" | "keyup", key: string, repeat = false) => {
  const event = new Event(type);
  Object.defineProperties(event, {
    key: { value: key },
    code: { value: `Key${key.toUpperCase()}` },
    ctrlKey: { value: false },
    altKey: { value: false },
    metaKey: { value: false },
    shiftKey: { value: false },
    repeat: { value: repeat },
  });
  return event;
};

describe("keyboard input", () => {
  beforeEach(() => {
    vi.stubGlobal("window", new EventTarget());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("tracks pressed keys and ignores repeated keydown events", () => {
    const keyboard = create_keyboard_listener();
    const keydown = vi.fn();
    keyboard.on("keydown", keydown);
    const unsubscribe = keyboard.subscribe();

    window.dispatchEvent(keyboard_event("keydown", "b"));
    window.dispatchEvent(keyboard_event("keydown", "a"));
    window.dispatchEvent(keyboard_event("keydown", "a", true));

    expect(keyboard.pressed_keys()).toEqual(["a", "b"]);
    expect(keydown).toHaveBeenCalledTimes(2);

    window.dispatchEvent(keyboard_event("keyup", "a"));
    expect(keyboard.is_down("a")).toBe(false);
    unsubscribe();
  });

  it("maps keys to commands and consumes just-pressed state", () => {
    const input = create_input_map({ attack: "a" });
    const attack = vi.fn();
    input.on("attack", attack);
    const unsubscribe = input.subscribe();

    window.dispatchEvent(keyboard_event("keydown", "A"));

    expect(input.is_down("attack")).toBe(true);
    expect(input.is_just_pressed("attack")).toBe(true);
    expect(input.is_just_pressed("attack")).toBe(false);
    expect(attack).toHaveBeenCalledTimes(1);

    window.dispatchEvent(keyboard_event("keyup", "A"));
    expect(input.is_down("attack")).toBe(false);
    unsubscribe();
  });
});
