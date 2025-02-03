import {render} from '../unitilies/renderDOM';
import Block from './Block';

interface Props {
  rootQuery: string;
}

export default class Route {

  private _pathname: string;
  private readonly _blockClass: new (...args: unknown[]) => Block;
  private _block: Block | null;
  private _props: Props;

  constructor(pathname: string, view: new (...args: unknown[]) => Block, props: Props) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string) {
    return pathname === this._pathname;
  }

  render(force: boolean = false) {
    if (force && this._block) {
      this._block.dispatchComponentDestroy();
      this._block = null;
    }

    if (!this._block) {
      this._block = new this._blockClass();
      render(this._props.rootQuery, this._block);

      if (force) {
        this._block.hide();
      }
      return;
    }

    this._block.show();
  }
}
