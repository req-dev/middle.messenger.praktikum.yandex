import './Modal.pcss';
import Block, { blockProps } from '../../framework/Block';
import Button from '../Button';
import Store from '../../framework/Store';
import { IFormStateData } from '../Form';

// for using in Store
export interface IModalState {
  formData?: IFormStateData,
  visible?: boolean,
  closable?: boolean
}

export interface ModalProps extends blockProps {
  title?: string,
  bodyMessage?: string,
  childrenList?: { body: Block[]; } & Record<string, Block[]>,
  closable?: boolean,
  closableWithButton?: boolean,
  cancelButtonText?: string,
  visible?: boolean,
  statePath?: string // if you specify this, modal will rely on global state
}

export class Modal<T extends ModalProps = ModalProps> extends Block<T> {

  cancelButton: Button;
  private store: Store;

  constructor(props: T) {
    super({
      ...props,
      className: 'modal__background',
      cancelButton: new Button({
        text: props.cancelButtonText ?? 'Cancel',
        darkMode: true,
        disabled: !props.closable && !props.closableWithButton,
        events: {
          ...props.events,
          click: () => this.closeButtonClicked()
        }
      }),
      events: {
        ...props.events,
        click: () => this.closeBkgClicked()
      }
    });
    this.store = new Store();
  }

  private modalClicked(e: Event) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }

  private closeButtonClicked() {
    if (this.props.closable || this.props.closableWithButton) {
      this.close();
    }
  }

  private closeBkgClicked() {
    if (this.props.closable) {
      this.close();
    }
  }

  open() {
    if (this.props.visible) {
      return;
    }

    const { statePath } = this.props;
    if (statePath) {
      this.store.set(statePath, { visible: true });
    } else {
      this.setProps({ visible: true });
    }
  }

  close() {
    if (!this.props.visible) {
      return;
    }

    const { statePath } = this.props;
    if (statePath) {
      this.store.set(statePath, { visible: false });
    } else {
      this.setProps({ visible: false });
    }
  }

  componentDidMount() {
    this.cancelButton = this.children['cancelButton'] as unknown as Button;

    this.updateVisibility();
    this.addListener();
  }

  componentDidUpdate(oldProps: T) {
    this.cancelButton.setProps({ disabled: !this.props.closable && !this.props.closableWithButton });
    this.updateVisibility();
    return super.componentDidUpdate(oldProps);
  }

  componentWillUnmount() {
    const element = this.getContent().querySelector('.modal') as HTMLElement;
    element.removeEventListener('click', this.modalClicked);
  }

  componentAfterUpdate() {
    this.addListener();
  }

  private updateVisibility() {
    if (this.props.visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  private addListener() {
    const element = this.getContent().querySelector('.modal') as HTMLElement;
    element.addEventListener('click', this.modalClicked);
  }

  render() {
    return `<modal class="modal">
                <div class="modal__title">{{title}}</div>
                {{#if bodyMessage}}
                    <div class="modal__message">{{bodyMessage}}</div>
                {{/if}}
                {{{body}}}
                {{#if cancelButtonText}}
                    {{{cancelButton}}}
                {{/if}}
            </modal>`;
  }
}
