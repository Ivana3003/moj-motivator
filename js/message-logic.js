(function (root, factory) {
  const logic = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = logic;
  } else {
    root.MojMotivatorLogic = logic;
  }
})(typeof globalThis !== "undefined" ? globalThis : window, () => {
  const normalizeMessage = (value, maxLength = 150) => {
    if (typeof value !== "string") {
      return { ok: false, error: "Poruka mora biti tekst." };
    }

    const text = value.trim();
    if (!text) {
      return { ok: false, error: "Polje ne sme biti prazno!" };
    }

    if (text.length > maxLength) {
      return {
        ok: false,
        error: `Poruka ne sme biti duža od ${maxLength} karaktera.`,
      };
    }

    return {
      ok: true,
      value: text.charAt(0).toUpperCase() + text.slice(1),
    };
  };

  const isDuplicateMessage = (message, messages, ignoredMessage = null) =>
    messages.some(
      (existingMessage) =>
        existingMessage === message && existingMessage !== ignoredMessage,
    );

  const pickNextMessage = (messages, lastMessage, random = Math.random) => {
    if (!Array.isArray(messages) || messages.length === 0) return null;

    const availableMessages = messages.filter(
      (message) => message !== lastMessage,
    );
    const source = availableMessages.length ? availableMessages : messages;
    return source[Math.floor(random() * source.length)];
  };

  return { normalizeMessage, isDuplicateMessage, pickNextMessage };
});
