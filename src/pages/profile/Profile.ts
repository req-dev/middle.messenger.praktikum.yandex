import Block, { blockProps } from '../../framework/Block';
import Button from '../../components/Button';
import TableInput from './components/TableInput';
import TableButton from './components/TableButton';

export default class ProfilePage extends Block<blockProps> {
  constructor(props?: blockProps) {
    super('div', {
      ...props,
      className: 'profile-page',

      emailInput: new TableInput({
        type: 'email',
        name: 'email',
        id: 'emailInput',
        hint: 'Email',
        placeholder: 'ivan@gmail.com',
        value: 'pochta@yandex.ru'
      }),
      loginInput: new TableInput({
        type: 'text',
        name: 'login',
        id: 'emailInput',
        hint: 'Login',
        placeholder: 'ivan',
        value: 'ivanivanov'
      }),
      firstNameInput: new TableInput({
        type: 'text',
        name: 'first_name',
        id: 'firstName',
        hint: 'First name',
        placeholder: 'Иван',
        value: 'Иван'
      }),
      secondNameInput: new TableInput({
        type: 'text',
        name: 'second_name',
        id: 'secondName',
        hint: 'Second name',
        placeholder: 'Иванов',
        value: 'Иванов'
      }),
      displayNameInput: new TableInput({
        type: 'text',
        name: 'display_name',
        id: 'displayName',
        hint: 'Nickname in Chats',
        placeholder: 'Иван',
        value: 'Иван'
      }),
      phoneInput: new TableInput({
        type: 'tel',
        name: 'phone',
        id: 'phone',
        hint: 'Phone',
        placeholder: '+7 (909) 967 30 30',
        value: '+7 (909) 967 30 30'
      }),

      oldPasswordInput: new TableInput({
        type: 'password',
        name: 'oldPassword',
        id: 'oldPassword',
        hint: 'Old password',
        placeholder: '•••••••••',
        value: 'asSB&&h78uHDd3'
      }),
      newPasswordInput: new TableInput({
        type: 'password',
        name: 'newPassword',
        id: 'newPassword',
        hint: 'New password',
        placeholder: '•••••••••••',
        value: 'asSB&&h78uHDd3sady7'
      }),
      repeatNewPasswordInput: new TableInput({
        type: 'password',
        name: 'repeatNewPassword',
        id: 'repeatNewPassword',
        hint: 'Repeat new password',
        placeholder: '•••••••••••',
        value: 'asSB&&h78uHDd3sady7'
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
      saveChangesButtons: new Button({
        text: 'Save changes',
      }),

      editingPasswordMode: true,
      editingMode: false,
    });
  }

  render() {
    return `
    <div class="profile-page__back-btn">
        <div class="profile-page__back-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="profile-page__back-btn-icon-svg" viewBox="0 -960 960 960"
                 fill="#FFFFFF">
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
            </svg>
        </div>
    </div>
    <div class="profile-page__body">
        <div class="profile-page__body-center">
            <form class="profile-page__body-center">
                <div class="profile-page__body-avatar">
                    <div class="profile-page__body-avatar-hint">
                        <div class="profile-page__body-avatar-hint-text">Change Avatar</div>
                    </div>
                    <input class="profile-page__body-avatar-input" type="file" name="avatar" accept="image/png, image/jpeg">
                </div>
                <h1 class="profile-page__body-name">Scott</h1>
                
                {{#if editingPasswordMode}}
                  <div class="profile-page__body-card">
                        {{{oldPasswordInput}}}
                        {{{newPasswordInput}}}
                        {{{repeatNewPasswordInput}}}
                  </div>
                {{else}}
                  <div class="profile-page__body-card">
                      {{{emailInput}}}
                      {{{loginInput}}}
                      {{{firstNameInput}}}
                      {{{secondNameInput}}}
                      {{{displayNameInput}}}
                      {{{phoneInput}}}
                  </div>
                {{/if}}
            </form>

            <div class="page__body-space-between-cards"></div>
            
            {{#if editingMode}}
                {{{saveChangesButtons}}}
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
