import { visit } from 'unist-util-visit';

function processInlineFootnotesInParent(parent, definitions, counter) {
  if (!parent || !Array.isArray(parent.children) || parent.type === 'footnoteDefinition') return;

  let i = 0;
  while (i < parent.children.length) {
    const node = parent.children[i];
    if (node.type !== 'text' || !node.value.includes('^[')) {
      i++;
      continue;
    }

    const startIdxInText = node.value.indexOf('^[');
    const textBefore = node.value.slice(0, startIdxInText);
    const textAfterStart = node.value.slice(startIdxInText + 2);

    let depth = 1;
    let endChildIdx = -1;
    let endPosInText = -1;

    let firstTextRemainder = textAfterStart;
    for (let c = 0; c < firstTextRemainder.length; c++) {
      if (firstTextRemainder[c] === '[') depth++;
      else if (firstTextRemainder[c] === ']') {
        depth--;
        if (depth === 0) {
          endChildIdx = i;
          endPosInText = c;
          break;
        }
      }
    }

    if (endChildIdx === -1) {
      for (let j = i + 1; j < parent.children.length; j++) {
        const nextNode = parent.children[j];
        if (nextNode.type === 'text') {
          for (let c = 0; c < nextNode.value.length; c++) {
            if (nextNode.value[c] === '[') depth++;
            else if (nextNode.value[c] === ']') {
              depth--;
              if (depth === 0) {
                endChildIdx = j;
                endPosInText = c;
                break;
              }
            }
          }
          if (endChildIdx !== -1) break;
        }
      }
    }

    if (endChildIdx === -1) {
      i++;
      continue;
    }

    const footnoteChildren = [];
    const count = ++counter.val;
    const id = `inline-${count}`;

    if (endChildIdx === i) {
      const content = textAfterStart.slice(0, endPosInText);
      const textAfterEnd = textAfterStart.slice(endPosInText + 1);

      if (content) {
        footnoteChildren.push({ type: 'text', value: content });
      }

      const newNodes = [];
      if (textBefore) newNodes.push({ type: 'text', value: textBefore });
      newNodes.push({ type: 'footnoteReference', identifier: id, label: String(count) });
      if (textAfterEnd) newNodes.push({ type: 'text', value: textAfterEnd });

      parent.children.splice(i, 1, ...newNodes);
      i += (textBefore ? 1 : 0) + 1;
    } else {
      if (textAfterStart) {
        footnoteChildren.push({ type: 'text', value: textAfterStart });
      }

      for (let mid = i + 1; mid < endChildIdx; mid++) {
        footnoteChildren.push(parent.children[mid]);
      }

      const endNode = parent.children[endChildIdx];
      const textInEndBefore = endNode.value.slice(0, endPosInText);
      const textInEndAfter = endNode.value.slice(endPosInText + 1);

      if (textInEndBefore) {
        footnoteChildren.push({ type: 'text', value: textInEndBefore });
      }

      const newNodes = [];
      if (textBefore) newNodes.push({ type: 'text', value: textBefore });
      newNodes.push({ type: 'footnoteReference', identifier: id, label: String(count) });
      if (textInEndAfter) newNodes.push({ type: 'text', value: textInEndAfter });

      const removeCount = endChildIdx - i + 1;
      parent.children.splice(i, removeCount, ...newNodes);
      i += (textBefore ? 1 : 0) + 1;
    }

    definitions.push({
      type: 'footnoteDefinition',
      identifier: id,
      label: String(count),
      children: [
        {
          type: 'paragraph',
          children: footnoteChildren
        }
      ]
    });
  }
}

export function remarkInlineFootnotes() {
  return function (tree) {
    const counter = { val: 0 };
    const definitions = [];

    visit(tree, (node) => {
      if (node.children && Array.isArray(node.children)) {
        processInlineFootnotesInParent(node, definitions, counter);
      }
    });

    tree.children.push(...definitions);
  };
}
