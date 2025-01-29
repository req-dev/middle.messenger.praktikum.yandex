import Block from '../framework/Block';

export function render(query: string, block: Block) {
  const root = document.querySelector(query);
  root.appendChild(block.getContent());
  block.dispatchComponentDidMount();
  return root;
}
