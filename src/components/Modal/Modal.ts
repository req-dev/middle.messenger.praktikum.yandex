import './Modal.pcss';
import Block, { blockProps } from '../../framework/Block';
import Button from '../Button';
import store from '../../framework/Store';

export interface ModalProps extends blockProps {
  title: string,
  bodyMessage?: string,
  childrenList?: { body: Block[]; } & Record<string, Block[]>,
  closable?: boolean,
  closableWithButton?: boolean,
  cancelButtonText?: string,
  visible?: boolean,
  statePath?: string // if you specify this, modal will rely on global state
}

export class Modal<T extends ModalProps> extends Block<T> {

  visible: boolean;
  cancelButton: Button;

  constructor(props: ModalProps) {
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

    this.visible = Boolean(props.visible);
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
    if (this.visible) {
      return;
    }
    this.visible = true;

    const { statePath } = this.props;
    if (statePath) {
      store.set(statePath, { visible: true });
    } else {
      this.setProps({ visible: true });
    }
  }

  close() {
    if (!this.visible) {
      return;
    }
    this.visible = false;

    const { statePath } = this.props;
    if (statePath) {
      store.set(statePath, { visible: false });
    } else {
      this.setProps({ visible: false });
    }
  }

  componentDidMount() {
    this.cancelButton = this.children['cancelButton'] as Button;

    this.updateVisibility();
    this.addListener();
  }

  componentDidUpdate(oldProps: ModalProps) {
    this.cancelButton.setProps({ disabled: !this.props.closable && !this.props.closableWithButton });
    this.updateVisibility();
    return super.componentDidUpdate(oldProps);
  }

  componentWillUnmount() {
    const element = this.getContent().querySelector('.modal');
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
    const element = this.getContent().querySelector('.modal');
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
