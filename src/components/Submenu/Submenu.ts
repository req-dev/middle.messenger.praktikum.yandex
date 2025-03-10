import './Submenu.pcss';
import Block, { blockProps } from '../../framework/Block';
import SubmenuButton from '../SubmenuButton';
import Store from '../../framework/Store';

interface SubmenuProps extends blockProps {
  childrenList?: { options: SubmenuButton[] } & Record<string, Block[]>,
  opened?: boolean,
  statePath?: string
}

export default class Submenu extends Block<SubmenuProps> {

  private store: Store;

  constructor(props: SubmenuProps) {
    super({
      ...props,
      className: 'submenu',
    });
    this.store = new Store();
  }

  open() {
    if (this.props.statePath) {
      this.store.set(this.props.statePath, true);
    } else {
      this.setProps({ opened: true });
    }
  }

  close() {
    if (this.props.statePath) {
      this.store.set(this.props.statePath, false);
    } else {
      this.setProps({ opened: false });
    }
  }

  componentDidMount() {
    this.updateVisibility();
  }

  componentDidUpdate(oldProps: SubmenuProps): boolean {
    this.updateVisibility();
    return super.componentDidUpdate(oldProps);
  }

  private updateVisibility() {
    if (this.props.opened) {
      this.show();
    } else {
      this.hide();
    }
  }

  render() {
    return `{{{options}}}`;
  }
}
