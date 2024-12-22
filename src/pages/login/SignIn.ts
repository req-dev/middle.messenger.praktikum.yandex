import Block, { blockProps } from '../../framework/Block';
import ModalTitle from '../../components/ModalTitle';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Form from '../../components/Form';

import { IValidateFormResult } from '../../unitilies/ValidateForm';

interface SignInProps extends blockProps{
  ModalTitle?: ModalTitle,
  form?: Form,
  SignInBtn?: Button,
  SignUpBtn?: Button,
}

export default class SignInPage extends Block<SignInProps> {

  form: Form;

  constructor(props?: SignInProps) {
    super('div', {
      ...props,
      ModalTitle: new ModalTitle({
        text: 'Log in'
      }),

      form: new Form({
        childrenList: {
          inputs: [
            new Input({
              hint: 'Login',
              type: 'text',
              placeholder: 'ivanivanov',
              name: 'login',
              id: 'loginInput',
            }),
            new Input({
              hint: 'Password',
              type: 'password',
              placeholder: '••••••••••••',
              name: 'password',
              id: 'passwordInput',
            }),
          ]
        }
      }),

      SignInBtn: new Button({
        text: 'Sign in',
        attr: { id: 'signinBtn' },
        events: {
          click: () => this.submit()
        }
      }),
      SignUpBtn: new Button({
        text: 'Create account',
        darkMode: true,
        attr: { id: 'signupBtn' }
      })
    });
  }

  componentDidMount() {
    this.form = this.children['form'] as Form;

    this.form.setProps({
      ...this.form.props,
      onSubmit: this.submitted
    });
  }

  submit(){
    this.form.submit();
  }

  submitted(result: IValidateFormResult){
    console.log(Object.fromEntries(result.data.entries()));
  }

  render() {
    return `<div class="login-page">
    <div class="login-page__modal">
        {{{ModalTitle}}}
        
        {{{form}}}
        <div class="login-page__modal-space"></div>
        {{{SignInBtn}}}
        {{{SignUpBtn}}}
    </div>
</div>`;
  }
}
