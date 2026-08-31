"use strict";

const { I18n } = require("../js/i18n.js");

describe("Moj Motivator translations", () => {
  test("provides matching Serbian and English keys", () => {
    expect(Object.keys(I18n.translations.en).sort()).toEqual(
      Object.keys(I18n.translations.sr).sort(),
    );
  });

  test("provides translated default messages for both languages", () => {
    expect(I18n.translations.sr.defaultMessages).toHaveLength(4);
    expect(I18n.translations.en.defaultMessages).toHaveLength(4);
    expect(I18n.translations.en.defaultMessages[0]).toBe(
      "It always seems impossible until it is done.",
    );
  });

  test("formats the focus length validation message", () => {
    expect(I18n.translations.en.focusTooLong(120)).toBe(
      "Focus cannot be longer than 120 characters.",
    );
  });
});
