const {
  normalizeMessage,
  isDuplicateMessage,
  pickNextMessage,
} = require("../js/message-logic.js");

describe("normalizeMessage", () => {
  test("trims and capitalizes a valid message", () => {
    expect(normalizeMessage("  napravi mali korak  ")).toEqual({
      ok: true,
      value: "Napravi mali korak",
    });
  });

  test("rejects an empty message", () => {
    expect(normalizeMessage("   ")).toEqual({
      ok: false,
      error: "Polje ne sme biti prazno!",
    });
  });

  test("rejects a message over the limit", () => {
    expect(normalizeMessage("a".repeat(151))).toEqual({
      ok: false,
      error: "Poruka ne sme biti duža od 150 karaktera.",
    });
  });
});

describe("message collections", () => {
  const messages = ["Prva poruka", "Druga poruka"];

  test("detects duplicates and supports an ignored message while editing", () => {
    expect(isDuplicateMessage("Prva poruka", messages)).toBe(true);
    expect(isDuplicateMessage("Prva poruka", messages, "Prva poruka")).toBe(
      false,
    );
  });

  test("picks a different message from the previous one", () => {
    expect(pickNextMessage(messages, "Prva poruka", () => 0)).toBe(
      "Druga poruka",
    );
  });

  test("falls back safely when only one message exists", () => {
    expect(pickNextMessage(["Jedina poruka"], "Jedina poruka", () => 0)).toBe(
      "Jedina poruka",
    );
  });

  test("returns null for an empty collection", () => {
    expect(pickNextMessage([], null)).toBeNull();
  });
});
