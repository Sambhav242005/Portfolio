import { visit } from 'unist-util-visit';

export default function remarkHighlight() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      if (typeof node.value === 'string' && node.value.includes('==')) {
  const parts: string[] = node.value.split(/==(.*?)==/g);
  const newNodes: any[] = [];

  parts.forEach((part: string, i: number) => {
          if (i % 2 === 1) {
            newNodes.push({
              type: 'html',
              value: `<mark class="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">${part}</mark>`,
            });
          } else if (part) {
            newNodes.push({ type: 'text', value: part });
          }
        });

        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1, ...newNodes);
          return;
        }
      }
    });
  };
}
