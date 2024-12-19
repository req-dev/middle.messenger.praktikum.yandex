import Block, { blockProps } from '../../framework/Block';
import ModalTitle from '../../components/ModalTitle';
import Input from '../../components/Input';
import Button from '../../components/Button';

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
      }),
      LoginInput: new Input({
        hint: 'Login',
        type: 'text',
        placeholder: 'ivanivanov',
        name: 'login',
        id: 'loginInput',
      }),
      FirstNameInput: new Input({
        hint: 'First name',
        type: 'text',
        placeholder: 'ivan',
        name: 'first_name',
        id: 'firstNameInput',
      }),
      SecondNameInput: new Input({
        hint: 'Second name',
        type: 'text',
        placeholder: 'ivanov',
        name: 'second_name',
        id: 'secondNameInput',
      }),
      PhoneInput: new Input({
        hint: 'Phone',
        type: 'tel',
        placeholder: '+7 (909) 967 30 30',
        name: 'phone',
        id: 'phoneInput',
      }),
      PasswordInput: new Input({
        hint: 'Password',
        type: 'password',
        placeholder: '••••••••••••',
        name: 'password',
        id: 'passwordInput',
      }),
      PasswordAgainInput: new Input({
        hint: 'Password again',
        type: 'password',
        placeholder: '•••••••••••',
        name: 'password_repeat',
        id: 'passwordAgainInput',
        errorText: 'Passwords do not match'
      }),

      SignInBtn: new Button({
        text: 'Sign in',
        darkMode: true,
        attr: { id: 'signinBtn' }
      }),
      SignUpBtn: new Button({
        text: 'Create account',
        attr: { id: 'signupBtn' }
      })
    });
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
        {{{SignUpBtn}}}
        {{{SignInBtn}}}
    </div>
</div>`;
  }
}
