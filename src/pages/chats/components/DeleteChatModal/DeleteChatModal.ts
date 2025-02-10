import Modal, { ModalProps } from '../../../../components/Modal';
import { IFormStateData } from '../../../../components/Form';
import connect from '../../../../framework/connectStore';
import Button from '../../../../components/Button';
import ChatsController from '../../../../controllers/chats-controller';
import { IAppState } from '../../../../framework/Store';

interface DeleteChatModalProps extends ModalProps {
  formData?: IFormStateData
}

class DeleteChatModal extends Modal<DeleteChatModalProps> {
  deleteButton: Button;
  chatsController: ChatsController;

  constructor(props?: DeleteChatModalProps) {
    super({
      ...props,
      title: 'Delete Chat?',
      bodyMessage: 'It will be impossible to restore it!',
      statePath: 'chatsPage.deleteChatModal',
      closable: true,
      childrenList: {
        body: [
          new Button({
            text: 'Delete',
            disabled: props?.formData?.disabled,
            events: {
              click: () => this.deleteChat()
            }
          }),
        ]
      }
    });

    this.chatsController = new ChatsController();
  }

  componentDidMount() {
    super.componentDidMount();
    this.deleteButton = this.props.childrenList?.body[0] as Button;
  }

  componentDidUpdate(oldProps: DeleteChatModalProps): boolean {
    this.deleteButton.setProps({ loading: this.props.formData?.disabled });
    return super.componentDidUpdate(oldProps);
  }

  deleteChat() {
    this.chatsController.deleteChat();
  }

}

const mapStateToProps = (state: IAppState) => state.chatsPage.deleteChatModal;

export default connect(mapStateToProps)(DeleteChatModal);
