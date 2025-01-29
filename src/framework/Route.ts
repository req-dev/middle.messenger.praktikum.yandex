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

  navigate(pathname) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname) {
    return pathname === this._pathname;
  }

  forceRerender() {
    if (this._block) {
      this._block.dispatchComponentDestroy();
      this._block = null;
    }
    this.render();
    this._block.hide();
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass();
      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}
