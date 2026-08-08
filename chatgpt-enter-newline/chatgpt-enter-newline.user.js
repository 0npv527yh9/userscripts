// ==UserScript==
// @name         Enter for New Line in ChatGPT
// @namespace    https://github.com/0npv527yh9/userscripts
// @version      1.0.0
// @description  Use Enter for a new line and Ctrl+Enter or Cmd+Enter to send messages on ChatGPT.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/0npv527yh9/userscripts/main/chatgpt-enter-newline/chatgpt-enter-newline.user.js
// @downloadURL  https://raw.githubusercontent.com/0npv527yh9/userscripts/main/chatgpt-enter-newline/chatgpt-enter-newline.user.js
// ==/UserScript==

(() => {
  "use strict";

  window.addEventListener("keydown", handleEnter, true);

  function handleEnter(event) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.altKey ||
      // Ignore synthetic events dispatched below.
      !event.isTrusted ||
      // Ignore IME events.
      event.isComposing
    ) {
      return;
    }

    const target = event.target;
    const editor = target.closest('section[data-turn="user"] textarea');
    if (editor) {
      handleEditorEnter(event, editor);
      return;
    }

    const input = target.closest('#prompt-textarea[contenteditable="true"]');
    if (input) handleInputEnter(event, input);
  }

  function handleEditorEnter(event, editor) {
    // Plain Enter already inserts a newline in the message editor.
    if (!event.ctrlKey && !event.metaKey) return;

    // Suppress the original event.
    event.preventDefault();
    event.stopImmediatePropagation();

    editor.closest("section")?.querySelector("button.btn-primary:not([disabled])")?.click();
  }

  function handleInputEnter(event, input) {
    // Suppress the original event.
    event.preventDefault();
    event.stopImmediatePropagation();

    const shouldPressShiftKey = !event.ctrlKey && !event.metaKey;

    const newEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      bubbles: true,
      shiftKey: shouldPressShiftKey,
    });
    input.dispatchEvent(newEvent);
  }
})();
