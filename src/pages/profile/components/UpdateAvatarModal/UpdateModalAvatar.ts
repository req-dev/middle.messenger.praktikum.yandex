import Modal, { ModalProps } from '../../../../components/Modal';
import Form, { IFormStateData } from '../../../../components/Form';
import { Input } from '../../../../components/Input';
import connect from '../../../../framework/connectStore';
import Button from '../../../../components/Button';
import UserAccountController from '../../../../controllers/user-account-controller';

interface UpdateModalAvatarProps extends ModalProps {
  title?: string;
  formData?: IFormStateData
}

class UpdateModalAvatar extends Modal<UpdateModalAvatarProps> {
  form: Form;
  applyButton: Button;
  userAccountController: UserAccountController;

  constructor(props?: UpdateModalAvatarProps) {
    super({
      ...props,
      title: 'Update avatar',
      statePath: 'profilePage.updateAvatarModal',
      closable: true,
      cancelButtonText: 'Cancel',
      childrenList: {
        body: [
          new Form({
            ...props?.formData,
            statePath: 'profilePage.updateAvatarModal.formData',
            childrenList: {
              inputs: [
                new Input({
                  type: 'file',
                  name: 'avatar',
                  id: 'avatarInput',
                  hint: 'Choose avatar',
                  accept: 'image/png, image/jpeg',
                }),
              ]
            }
          }),
          new Button({
            text: 'Apply',
            disabled: props?.formData?.disabled,
            events: {
              click: () => this.form.submit()
            }
          }),
        ]
      }
    });

    this.userAccountController = new UserAccountController();
  }

  componentDidMount() {
    super.componentDidMount();
    this.form = this.props.childrenList?.body[0] as Form;
    this.applyButton = this.props.childrenList?.body[1] as Button;

    this.form.setProps({
      onSubmit: () => this.submitted()
    });

    // when a user clicks on the form, it starts validating which causes lose focus
    // to prevent that, form already has to have an error
    // so that way focus will be saved, and the selected file will not get lost
    this.form.validate();
  }

  componentDidUpdate(oldProps: ModalProps): boolean {
    this.form.setProps({ ...this.props.formData })
    this.applyButton.setProps({ loading: this.props.formData?.disabled });
    return super.componentDidUpdate(oldProps);
  }

  submitted() {
    this.userAccountController.updateAvatar(this.form.getFormData());
  }

}

const mapStateToProps = state => state.profilePage.updateAvatarModal;

export default connect(mapStateToProps)(UpdateModalAvatar);
