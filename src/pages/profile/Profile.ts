import Block, { blockProps } from '../../framework/Block';
import BackButton from './components/BackButton';
import Button from '../../components/Button';
import TableInput from './components/TableInput';
import TableButton from './components/TableButton';
import Form, { IFormStateData } from '../../components/Form';
import UserSessionController from '../../controllers/user-session-controller';
import UserAccountController from '../../controllers/user-account-controller';
import connect from '../../framework/connectStore';
import isEqual from '../../unitilies/isEqual';
import { UserModel, UpdateProfileRequest, UpdatePasswordRequest } from '../../types/data';
import store from '../../framework/Store';
import UpdateModalAvatar from './components/UpdateAvatarModal';
import UpdateAvatarButton from './components/UpdateAvatarButton';

interface ProfilePageProps extends blockProps {
  updateAvatarButton?: Block,
  editProfileForm?: Form,
  editPasswordForm?: Form,
  editButton?: TableButton,
  changePasswordButton?: TableButton,
  logOutButton?: TableButton,
  saveChangesButton?: Button,
  cancelButton?: Button,
  modal?: Block,

  editingPasswordMode?: boolean,
  editingMode?: boolean,

  editProfileFormData?: IFormStateData,
  editPasswordFormData?: IFormStateData,
  userData?: UserModel
}

class ProfilePage extends Block<ProfilePageProps> {

  editProfileForm: Form;
  editPasswordForm: Form;
  saveChangesButton: Button;
  cancelButton: Button;
  userSessionController: UserSessionController;
  userAccountController: UserAccountController;
  modal: Block;

  constructor(props?: ProfilePageProps) {
    super({
      ...props,

      updateAvatarButton: new UpdateAvatarButton({
        events: {
          click: () => this.modal.setProps({ visible: true })
        }
      }),
      editProfileForm: new Form({
        className: 'profile-page__body-card',
        ...props?.editProfileFormData,
        statePath: 'profilePage.editProfileFormData',
        childrenList: {
          inputs: [
            new TableInput({
              type: 'email',
              name: 'email',
              id: 'emailInput',
              hint: 'Email',
              placeholder: 'ivan@gmail.com',
            }),
            new TableInput({
              type: 'text',
              name: 'login',
              id: 'emailInput',
              hint: 'Login',
              placeholder: 'ivan',
            }),
            new TableInput({
              type: 'text',
              name: 'first_name',
              id: 'firstName',
              hint: 'First name',
              placeholder: 'Иван',
            }),
            new TableInput({
              type: 'text',
              name: 'second_name',
              id: 'secondName',
              hint: 'Second name',
              placeholder: 'Иванов',
            }),
            new TableInput({
              type: 'text',
              name: 'display_name',
              id: 'displayName',
              hint: 'Nickname in Chats',
              placeholder: 'Иван',
            }),
            new TableInput({
              type: 'tel',
              name: 'phone',
              id: 'phone',
              hint: 'Phone',
              placeholder: '+71307654942',
            }),
          ]
        }
      }),

      editPasswordForm: new Form({
        className: 'profile-page__body-card',
        ...props?.editPasswordFormData,
        statePath: 'profilePage.editPasswordFormData',
        childrenList: {
          inputs: [
            new TableInput({
              type: 'password',
              name: 'oldPassword',
              id: 'oldPassword',
              hint: 'Old password',
              placeholder: '•••••••••',
            }),
            new TableInput({
              type: 'password',
              name: 'newPassword',
              id: 'newPassword',
              hint: 'New password',
              placeholder: '•••••••••••',
            }),
            new TableInput({
              type: 'password',
              name: 'repeatNewPassword',
              id: 'repeatNewPassword',
              hint: 'Repeat new password',
              placeholder: '•••••••••••',
            }),
          ]
        }
      }),

      modal: new UpdateModalAvatar({}),

      editButton: new TableButton({
        text: 'Edit',
        events: {
          click: () => store.set('profilePage.editingMode', true)
        }
      }),
      changePasswordButton: new TableButton({
        text: 'Change Password',
        events: {
          click: () => store.set('profilePage', {
            editingMode: true,
            editingPasswordMode: true
          })
        }
      }),
      logOutButton: new TableButton({
        text: 'Log out',
        red: true,
        events: {
          click: () => this.userSessionController.logout()
        }
      }),
      saveChangesButton: new Button({
        text: 'Save changes',
        events: {
          click: () => this.saveChanges()
        }
      }),
      cancelButton: new Button({
        text: 'Cancel',
        darkMode: true,
        events: {
          click: () => this.back()
        }
      }),

      backButton: new BackButton({
        events: {
          click: () => this.back()
        }
      })
    });

    this.userSessionController = new UserSessionController();
    this.userAccountController = new UserAccountController();
  }

  componentDidMount() {
    this.editProfileForm = this.children['editProfileForm'] as Form;
    this.editPasswordForm = this.children['editPasswordForm'] as Form;
    this.saveChangesButton = this.children['saveChangesButton'] as Button;
    this.cancelButton = this.children['cancelButton'] as Button;
    this.modal = this.children['modal'];


    this.fillProfileFormWithUser();
    this.editProfileForm.setProps({
      onSubmit: () => this.editProfileSubmitted()
    });
    this.editPasswordForm.setProps({
      onSubmit: () => this.editPasswordSubmitted()
    });

    // the form must be disabled until the user clicks 'edit'
    this.editProfileForm.setProps({ disabled: true });
  }

  componentDidUpdate(oldProps: ProfilePageProps): boolean {
    // applying user data when server sends it
    const oldUserData = (oldProps.userData as Record<string, string> | undefined) ?? {};
    const userData = (this.props.userData as Record<string, string> | undefined) ?? {};
    if (!isEqual(oldUserData, userData)) {
      this.fillProfileFormWithUser();
    }

    // apply error messages to forms
    const profileFormDisabled = Boolean(this.props?.editProfileFormData?.disabled);
    const passwordFormDisabled = Boolean(this.props?.editPasswordFormData?.disabled);
    const saveChangesButtonDisabled = this.props.editingMode ? profileFormDisabled || passwordFormDisabled : false;

    this.saveChangesButton.setProps({ disabled: saveChangesButtonDisabled });
    this.cancelButton.setProps({ disabled: saveChangesButtonDisabled });
    this.editProfileForm.setProps({
      ...this.props?.editProfileFormData,
      disabled: profileFormDisabled | !this.props.editingMode
    });
    this.editPasswordForm.setProps({ ...this.props?.editPasswordFormData });
    return super.componentDidUpdate(oldProps);
  }

  back() {
    if (!this.props.editingMode && !this.props.editingPasswordMode) {
      window.history.back();
      return;
    }

    this.editProfileForm.clear();
    this.editPasswordForm.clear();
    this.fillProfileFormWithUser();
    store.set('profilePage', {
      editingMode: false,
      editingPasswordMode: false
    });
  }

  saveChanges() {
    if (!this.props.editingMode) {
      return;
    }
    if (this.props.editingPasswordMode) {
      this.editPasswordForm.submit();
    } else {
      this.editProfileForm.submit();
    }
  }

  fillProfileFormWithUser() {
    const userData = (this.props.userData as Record<string, string> | undefined) ?? {};
    this.editProfileForm.setValues(userData);
  }

  editProfileSubmitted(){
    console.log(this.editProfileForm.getData());
    this.userAccountController.updateProfile(this.editProfileForm.getData() as UpdateProfileRequest);
  }

  editPasswordSubmitted(){
    console.log(this.editPasswordForm.getData());
    this.userAccountController.updatePassword(this.editPasswordForm.getData() as UpdatePasswordRequest);
  }

  render() {
    return `
    <div class="profile-page">
      {{{backButton}}}
      <div class="profile-page__body">
          <div class="profile-page__body-center">
              {{{modal}}}
              <div class="profile-page__body-center">
                  {{{updateAvatarButton}}}
                  <h1 class="profile-page__body-name">Scott</h1>
                  
                  {{#if editingPasswordMode}}
                    {{{editPasswordForm}}}
                  {{else}}
                    {{{editProfileForm}}}
                  {{/if}}
                  
              </div>
  
              <div class="page__body-space-between-cards"></div>
              
              {{#if editingMode}}
                  {{{saveChangesButton}}}
                  {{{cancelButton}}}
              {{else}}
                <div class="profile-page__body-card profile-page__body-card_actions">
                    {{{editButton}}}
                    {{{changePasswordButton}}}
                    {{{logOutButton}}}
                </div>
              {{/if}}
          </div>
      </div>
    </div>`;
  }
}

const mapStateToProps = state => state.profilePage;

export default connect(mapStateToProps)(ProfilePage);
