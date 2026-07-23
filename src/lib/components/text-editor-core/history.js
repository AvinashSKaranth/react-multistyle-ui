/**
 * Undo/redo history stack for the custom editor.
 */

export function createHistory(limit = 100) {
  const stack = [];
  let index = -1;
  let composing = false;

  function record(html) {
    if (composing) return;
    // Avoid duplicate consecutive records.
    if (stack[index]?.html === html) return;

    // Truncate redo entries when a new action occurs after undo.
    if (index < stack.length - 1) {
      stack.splice(index + 1);
    }

    stack.push({ html, time: Date.now() });
    if (stack.length > limit) {
      stack.shift();
    } else {
      index++;
    }
  }

  function undo(currentHtml) {
    if (index <= 0) return null;
    if (stack[index].html !== currentHtml) {
      record(currentHtml);
    }
    index--;
    return stack[index]?.html ?? null;
  }

  function redo() {
    if (index >= stack.length - 1) return null;
    index++;
    return stack[index]?.html ?? null;
  }

  function canUndo() {
    return index > 0;
  }

  function canRedo() {
    return index < stack.length - 1;
  }

  function startComposition() {
    composing = true;
  }

  function endComposition(html) {
    composing = false;
    record(html);
  }

  function clear() {
    stack.length = 0;
    index = -1;
  }

  return {
    record,
    undo,
    redo,
    canUndo,
    canRedo,
    startComposition,
    endComposition,
    clear,
    get length() {
      return stack.length;
    },
  };
}
