import Block, { blockProps } from '../../framework/Block';
import ModalTitle from '../../components/ModalTitle';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInProps extends blockProps{
  ModalTitle?: ModalTitle,
  LoginInput?: Input,
  PasswordInput?: Input,
  SignInBtn?: Button,
  SignUpBtn?: Button,
}

export default class SignInPage extends Block<SignInProps> {
  constructor(props?: SignInProps) {
    super('div', {
      ...props,
      ModalTitle: new ModalTitle({
        text: 'Log in'
      }),
      LoginInput: new Input({
        hint: 'Login',
        type: 'text',
        placeholder: 'ivanivanov',
        name: 'login',
        id: 'loginInput',
        errorText: 'The login is wrong',
      }),
      PasswordInput: new Input({
        hint: 'Password',
        type: 'password',
        placeholder: '••••••••••••',
        name: 'password',
        id: 'passwordInput',
      }),
      SignInBtn: new Button({
        text: 'Sign in',
        attr: { id: 'signinBtn' }
      }),
      SignUpBtn: new Button({
        text: 'Create account',
        darkMode: true,
        attr: { id: 'signupBtn' }
      })
    });
  }
  render() {
    return `<div class="login-page">
    <div class="login-page__modal">
        {{{ModalTitle}}}
        <form class="login-page__form">
            {{{LoginInput}}}
            {{{PasswordInput}}}
        </form>
        <div class="login-page__modal-space"></div>
        {{{SignInBtn}}}
        {{{SignUpBtn}}}
    </div>
</div>`;
  }
}
