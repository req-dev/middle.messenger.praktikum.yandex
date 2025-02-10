import Modal, { ModalProps } from '../../../../components/Modal';
import Form, { IFormStateData } from '../../../../components/Form';
import { Input } from '../../../../components/Input';
import connect from '../../../../framework/connectStore';
import Button from '../../../../components/Button';
import ChatsController from '../../../../controllers/chats-controller';
import { IAppState } from '../../../../framework/Store';

interface AddUserModalProps extends ModalProps {
  formData?: IFormStateData
}

class AddUserModal extends Modal<AddUserModalProps> {
  form: Form;
  addButton: Button;
  chatsController: ChatsController;

  constructor(props?: AddUserModalProps) {
    super({
      ...props,
      title: 'Add a User',
      statePath: 'chatsPage.addUserModal',
      closable: true,
      childrenList: {
        body: [
          new Form({
            ...props?.formData,
            statePath: 'chatsPage.addUserModal.formData',
            childrenList: {
              inputs: [
                new Input({
                  type: 'text',
                  name: 'login',
                  id: 'userLoginInput',
                  hint: 'Login',
                  placeholder: 'ivanivanov',
                }),
              ]
            }
          }),
          new Button({
            text: 'Add',
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
    this.addButton = this.props.childrenList?.body[1] as Button;

    this.form.setProps({
      onSubmit: () => this.submitted()
    });
    this.form.validate();
  }

  componentDidUpdate(oldProps: AddUserModalProps): boolean {
    this.form.setProps({ ...this.props.formData })
    this.addButton.setProps({ loading: this.props.formData?.disabled });
    return super.componentDidUpdate(oldProps);
  }

  submitted() {
    const user = Object.values(this.form.getData())[0];
    this.chatsController.addUser(user)
      .then((success) => {
        if (success) {
          // return the form to the initial state
          this.form.clear();
          this.form.validate();
        }
      });
  }

}

const mapStateToProps = (state: IAppState) => state.chatsPage.addUserModal;

export default connect(mapStateToProps)(AddUserModal);
