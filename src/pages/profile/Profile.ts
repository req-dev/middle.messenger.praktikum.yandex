import Block, { blockProps } from '../../framework/Block';
import BackButton from './components/BackButton';
import Button from '../../components/Button';
import TableInput from './components/TableInput';
import TableButton from './components/TableButton';
import Form from '../../components/Form';
import { IValidateFormResult } from '../../unitilies/ValidateForm';

interface ProfilePageProps extends blockProps {
  editProfileForm?: Form,
  editPasswordForm?: Form,
  editButton?: TableButton,
  changePasswordButton?: TableButton,
  logOutButton?: TableButton,
  saveChangesButton?: Button,
  editingPasswordMode?: boolean,
  editingMode?: boolean,
}

export default class ProfilePage extends Block<ProfilePageProps> {

  editProfileForm: Form;
  editPasswordForm: Form;

  constructor(props?: ProfilePageProps) {
    super('div', {
      ...props,
      className: 'profile-page',

      editProfileForm: new Form({
        className: 'profile-page__body-card',
        childrenList: {
          inputs: [
            new TableInput({
              type: 'email',
              name: 'email',
              id: 'emailInput',
              hint: 'Email',
              placeholder: 'ivan@gmail.com',
              value: 'pochta@yandex.ru'
            }),
            new TableInput({
              type: 'text',
              name: 'login',
              id: 'emailInput',
              hint: 'Login',
              placeholder: 'ivan',
              value: 'ivanivanov'
            }),
            new TableInput({
              type: 'text',
              name: 'first_name',
              id: 'firstName',
              hint: 'First name',
              placeholder: 'Иван',
              value: 'Иван'
            }),
            new TableInput({
              type: 'text',
              name: 'second_name',
              id: 'secondName',
              hint: 'Second name',
              placeholder: 'Иванов',
              value: 'Иванов'
            }),
            new TableInput({
              type: 'text',
              name: 'display_name',
              id: 'displayName',
              hint: 'Nickname in Chats',
              placeholder: 'Иван',
              value: 'Иван'
            }),
            new TableInput({
              type: 'tel',
              name: 'phone',
              id: 'phone',
              hint: 'Phone',
              placeholder: '+7 (909) 967 30 30',
              value: '+7 (909) 967 30 30'
            }),
          ]
        }
      }),

      editPasswordForm: new Form({
        className: 'profile-page__body-card',
        childrenList: {
          inputs: [
            new TableInput({
              type: 'password',
              name: 'oldPassword',
              id: 'oldPassword',
              hint: 'Old password',
              placeholder: '•••••••••',
              value: 'asSB&&h78uHDd3'
            }),
            new TableInput({
              type: 'password',
              name: 'newPassword',
              id: 'newPassword',
              hint: 'New password',
              placeholder: '•••••••••••',
              value: 'asSB&&h78uHDd3sady7'
            }),
            new TableInput({
              type: 'password',
              name: 'repeatNewPassword',
              id: 'repeatNewPassword',
              hint: 'Repeat new password',
              placeholder: '•••••••••••',
              value: 'asSB&&h78uHDd3sady7'
            }),
          ]
        }
      }),

      editButton: new TableButton({
        text: 'Edit'
      }),
      changePasswordButton: new TableButton({
        text: 'Change Password'
      }),
      logOutButton: new TableButton({
        text: 'Log out',
        red: true
      }),
      saveChangesButton: new Button({
        text: 'Save changes'
      }),

      backButton: new BackButton()
    });
  }

  componentDidMount() {
    // adding event listeners
    // I do it here bc only after this class initialized we can pass context (this)
    const editButton = this.children['editButton'];
    const changePasswordButton = this.children['changePasswordButton'];
    const saveChangesButton = this.children['saveChangesButton'];
    const backButton = this.children['backButton'];

    editButton.setProps({
      events: {
        ...editButton.props.events,
        click: () => this.setProps({
          editingMode: true
        })
      }
    });
    changePasswordButton.setProps({
      events: {
        ...changePasswordButton.props.events,
        click: () => this.setProps({
          editingMode: true,
          editingPasswordMode: true
        })
      }
    });
    saveChangesButton.setProps({
      events: {
        ...saveChangesButton.props.events,
        click: () => {
          this.props.editingPasswordMode ? this.editPasswordSubmit() : this.editProfileSubmit();
        }
      }
    });
    backButton.setProps({
      events: {
        ...backButton.props.events,
        click: () => this.setProps({
          editingMode: false,
          editingPasswordMode: false
        })
      }
    });
    this.editProfileForm = this.children['editProfileForm'] as unknown as Form;
    this.editPasswordForm = this.children['editPasswordForm'] as unknown as Form;

    this.editProfileForm.setProps({
      onSubmit: (r: IValidateFormResult) => this.editProfileSubmitted(r)
    });
    this.editPasswordForm.setProps({
      onSubmit: (r: IValidateFormResult) => this.editPasswordSubmitted(r)
    });
  }

  editProfileSubmit(){
    this.editProfileForm.submit();
  }

  editProfileSubmitted(result: IValidateFormResult){
    this.setProps({
      editingMode: false,
      editingPasswordMode: false
    });
    console.log(Object.fromEntries(result.data.entries()));
  }

  editPasswordSubmit(){
    this.editPasswordForm.submit();
  }

  editPasswordSubmitted(result: IValidateFormResult){
    this.setProps({
      editingMode: false,
      editingPasswordMode: false
    });
    console.log(Object.fromEntries(result.data.entries()));
  }

  render() {
    return `
    {{{backButton}}}
    <div class="profile-page__body">
        <div class="profile-page__body-center">
            <div class="profile-page__body-center">
                <div class="profile-page__body-avatar">
                    <div class="profile-page__body-avatar-hint">
                        <div class="profile-page__body-avatar-hint-text">Change Avatar</div>
                    </div>
                    <input class="profile-page__body-avatar-input" type="file" name="avatar" accept="image/png, image/jpeg">
                </div>
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
            {{else}}
              <div class="profile-page__body-card profile-page__body-card_actions">
                  {{{editButton}}}
                  {{{changePasswordButton}}}
                  {{{logOutButton}}}
              </div>
            {{/if}}
        </div>
    </div>`;
  }
}
