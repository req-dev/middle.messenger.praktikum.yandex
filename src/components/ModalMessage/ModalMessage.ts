import Modal, { ModalProps } from '../../components/Modal';
import connect from '../../framework/connectStore';
import Button from '../../components/Button';
import { IAppState } from '../../framework/Store';

class ModalMessage extends Modal {
  constructor(props?: ModalProps) {
    super({
      ...props,
      title: props?.title ?? '',
      statePath: 'globalModalMessage',
      closable: true,
      childrenList: {
        body: [
          new Button({
            text: 'OK, got it',
            events: {
              click: () => this.close()
            }
          }),
        ]
      }
    });
  }

}

const mapStateToProps = (state: IAppState) => state.globalModalMessage;

export default connect<ModalProps>(mapStateToProps)(ModalMessage);
