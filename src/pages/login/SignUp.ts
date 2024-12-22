import Block, { blockProps } from '../../framework/Block';
import ModalTitle from '../../components/ModalTitle';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { ValidateForm } from '../../unitilies/ValidateForm';

interface SignUpProps extends blockProps{
  ModalTitle?: ModalTitle,
  EmailInput?: Input,
  LoginInput?: Input,
  FirstNameInput?: Input,
  SecondNameInput?: Input,
  PhoneInput?: Input,
  PasswordInput?: Input,
  PasswordAgainInput?: Input,
  SignInBtn?: Button,
  SignUpBtn?: Button,
}

export default class SignUpPage extends Block<SignUpProps> {
  protected ValidateForm: ValidateForm;

  constructor(props?: SignUpProps) {
    super('div', {
      ...props,
      ModalTitle: new ModalTitle({
        text: 'Create an Account'
      }),

      EmailInput: new Input({
        hint: 'E-mail',
        type: 'email',
        placeholder: 'pochta@yandex.ru',
        name: 'email',
        id: 'emailInput',
        events: {
          blur: () => this.checkForm()
        }
      }),
      LoginInput: new Input({
        hint: 'Login',
        type: 'text',
        placeholder: 'ivanivanov',
        name: 'login',
        id: 'loginInput',
        events: {
          blur: () => this.checkForm()
        }
      }),
      FirstNameInput: new Input({
        hint: 'First name',
        type: 'text',
        placeholder: 'ivan',
        name: 'first_name',
        id: 'firstNameInput',
        events: {
          blur: () => this.checkForm()
        }
      }),
      SecondNameInput: new Input({
        hint: 'Second name',
        type: 'text',
        placeholder: 'ivanov',
        name: 'second_name',
        id: 'secondNameInput',
        events: {
          blur: () => this.checkForm()
        }
      }),
      PhoneInput: new Input({
        hint: 'Phone',
        type: 'tel',
        placeholder: '+7 (909) 967 30 30',
        name: 'phone',
        id: 'phoneInput',
        events: {
          blur: () => this.checkForm()
        }
      }),
      PasswordInput: new Input({
        hint: 'Password',
        type: 'password',
        placeholder: '••••••••••••',
        name: 'password',
        id: 'passwordInput',
        events: {
          blur: () => this.checkForm()
        }
      }),
      PasswordAgainInput: new Input({
        hint: 'Password again',
        type: 'password',
        placeholder: '•••••••••••',
        name: 'password_repeat',
        id: 'passwordAgainInput',
        events: {
          blur: () => this.checkForm()
        }
      }),

      SignInBtn: new Button({
        text: 'Sign in',
        darkMode: true,
        attr: { id: 'signinBtn' }
      }),
      SignUpBtn: new Button({
        text: 'Create account',
        attr: { id: 'signupBtn' },
        events: {
          click: () => {
            this.sendForm();
          }
        }
      })
    });

    this.ValidateForm = new ValidateForm(this.getContent().querySelector('form'), Object.values(this.children) as Input[]);
  }

  checkForm(){
    return this.ValidateForm.check();
  }

  sendForm(){
    const checkResult = this.checkForm();
    if (!checkResult.valid) return;

    console.log(Object.fromEntries(checkResult.data.entries()));
  }

  render() {
    return `<div class="login-page">
    <div class="login-page__modal">
        {{{ModalTitle}}}
        <form class="login-page__form">
            {{{EmailInput}}}
            {{{LoginInput}}}
            {{{FirstNameInput}}}
            {{{SecondNameInput}}}
            {{{PhoneInput}}}
            {{{PasswordInput}}}
            {{{PasswordAgainInput}}}
        </form>
        <div class="login-page__modal-space login-page__modal-space_signup"></div>
        {{{SignInBtn}}}
        {{{SignUpBtn}}}
    </div>
</div>`;
  }
}
