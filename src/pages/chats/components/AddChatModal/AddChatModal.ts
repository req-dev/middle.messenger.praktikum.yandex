import Modal, { ModalProps } from '../../../../components/Modal';
import Form, { IFormStateData } from '../../../../components/Form';
import { Input } from '../../../../components/Input';
import connect from '../../../../framework/connectStore';
import Button from '../../../../components/Button';
import ChatsController from '../../../../controllers/chats-controller';
import { CreateChatRequest } from '../../../../types/data';

interface AddChatModalProps extends ModalProps {
  title?: string;
  formData?: IFormStateData
}

class AddChatModal extends Modal<AddChatModalProps> {
  form: Form;
  createButton: Button;
  chatsController: ChatsController;

  constructor(props?: AddChatModalProps) {
    super({
      ...props,
      title: 'Create a Chat',
      statePath: 'chatsPage.createChatModal',
      closable: true,
      childrenList: {
        body: [
          new Form({
            ...props?.formData,
            statePath: 'chatsPage.createChatModal.formData',
            childrenList: {
              inputs: [
                new Input({
                  type: 'text',
                  name: 'title',
                  id: 'chatTitleInput',
                  hint: 'Chat title',
                  placeholder: 'Family vacation',
                }),
              ]
            }
          }),
          new Button({
            text: 'Create',
            disabled: props?.formData?.disabled,
            events: {
              click: () => this.form.submit()
            }
          }),
        ]
      }
    });

    this.chatsController = new ChatsController();
  }

  componentDidMount() {
    super.componentDidMount();
    this.form = this.props.childrenList?.body[0] as Form;
    this.createButton = this.props.childrenList?.body[1] as Button;

    this.form.setProps({
      onSubmit: () => this.submitted()
    });
    this.form.validate();
  }

  componentDidUpdate(oldProps: ModalProps): boolean {
    this.form.setProps({ ...this.props.formData })
    this.createButton.setProps({ loading: this.props.formData?.disabled });
    return super.componentDidUpdate(oldProps);
  }

  submitted() {
    this.chatsController.createChat(this.form.getData() as CreateChatRequest)
      .then((success) => {
      if (success) {
        // return the form to the initial state
        this.form.clear();
        this.form.validate();
      }
    });
  }

}

const mapStateToProps = state => state.chatsPage.createChatModal;

export default connect(mapStateToProps)(AddChatModal);
