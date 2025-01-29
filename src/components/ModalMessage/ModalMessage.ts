import Modal, { ModalProps } from '../../components/Modal';
import connect from '../../framework/connectStore';
import Button from '../../components/Button';

interface ModalMessageProps extends ModalProps {
  title?: string;
  bodyMessage?: string;
  visible?: boolean;
}

class ModalMessage extends Modal<ModalMessageProps> {
  constructor(props?: ModalMessageProps) {
    super({
      ...props,
      title: props?.title ?? '',
      statePath: 'globalModalMessage',
      closable: true,
      childrenList: {
        body: [
          new Button({
            text: 'OK, I got it',
            events: {
              click: () => this.close()
            }
          }),
        ]
      }
    });
  }

}

const mapStateToProps = state => state.globalModalMessage;

export default connect(mapStateToProps)(ModalMessage);
