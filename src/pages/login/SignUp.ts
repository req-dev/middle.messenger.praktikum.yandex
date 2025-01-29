import Block, { blockProps } from '../../framework/Block';
import ModalTitle from '../../components/ModalTitle';
import Form, { IFormStateData } from '../../components/Form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { SignupFormModel } from '../../types/data';
import UserSignupController from '../../controllers/user-signup-controller';
import getRandomNumber from '../../unitilies/getRandomNumber';

import connect from '../../framework/connectStore';
import Router from '../../framework/Router';
import ModalMessage from '../../components/ModalMessage';

const randomPassword = `a${getRandomNumber()}cA1`;

interface SignUpProps extends blockProps{
  modalMessage: Block,
  ModalTitle?: ModalTitle,
  form?: Form,
  SignInBtn?: Button,
  SignUpBtn?: Button,
  FormStateData?: IFormStateData
}

class SignUpPage extends Block<SignUpProps> {
  form: Form;
  signInBtn: Button;
  signUpBtn: Button;
  router: Router;
  userSignupController: UserSignupController;

  constructor(props?: SignUpProps) {
    super({
      ...props,
      ModalTitle: new ModalTitle({
        text: 'Create an Account'
      }),
      modalMessage: new ModalMessage(),

      form: new Form({
        ...props?.FormStateData,
        statePath: 'signupPage.FormStateData',
        childrenList: {
          inputs: [
            new Input({
              hint: 'E-mail',
              type: 'email',
              placeholder: 'pochta@yandex.ru',
              name: 'email',
              id: 'emailInput',
              value: `a${getRandomNumber()}@gmail.com`
            }),
            new Input({
              hint: 'Login',
              type: 'text',
              placeholder: 'ivanivanov',
              name: 'login',
              id: 'loginInput',
              value: `a${getRandomNumber()}`
            }),
            new Input({
              hint: 'First name',
              type: 'text',
              placeholder: 'ivan',
              name: 'first_name',
              id: 'firstNameInput',
              value: 'Alex'
            }),
            new Input({
              hint: 'Second name',
              type: 'text',
              placeholder: 'ivanov',
              name: 'second_name',
              id: 'secondNameInput',
              value: 'Alexeev'
            }),
            new Input({
              hint: 'Phone',
              type: 'tel',
              placeholder: '+7 (909) 967 30 30',
              name: 'phone',
              id: 'phoneInput',
              value: `+7${getRandomNumber()}`
            }),
            new Input({
              hint: 'Password',
              type: 'password',
              placeholder: '••••••••••••',
              name: 'password',
              id: 'passwordInput',
              value: randomPassword
            }),
            new Input({
              hint: 'Password again',
              type: 'password',
              placeholder: '•••••••••••',
              name: 'password_repeat',
              id: 'passwordAgainInput',
              value: randomPassword
            }),
          ]
        }
      }),

      SignUpBtn: new Button({
        text: 'Create account',
        attr: { id: 'signupBtn' },
        events: {
          click: () => this.form.submit()
        }
      }),
      SignInBtn: new Button({
        text: 'Sign in',
        darkMode: true,
        attr: { id: 'signinBtn' },
        events: {
          click: () => this.router.go('/')
        }
      })
    });

    this.router = new Router();
    this.userSignupController = new UserSignupController();
  }

  componentDidMount() {
    this.form = this.children['form'] as Form;
    this.signInBtn = this.children['SignInBtn'] as Button;
    this.signUpBtn = this.children['SignUpBtn'] as Button;

    this.form.setProps({
      onSubmit: () => this.submitted()
    });
  }

  componentDidUpdate(oldProps: SignUpProps): boolean {
    this.form.setProps({ ...this.props?.FormStateData });
    this.signInBtn.setProps({
      disabled: this.props?.FormStateData?.disabled,
    });
    this.signUpBtn.setProps({
      disabled: this.props?.FormStateData?.disabled,
      loading: this.props?.FormStateData?.disabled,
    });
    return super.componentDidUpdate(oldProps);
  }

  submitted(){
    this.userSignupController.signup(this.form.getData() as SignupFormModel);

  }

  render() {
    return `<div class="login-page">
    <div class="login-page__modal">
        {{{ModalTitle}}}

        {{{form}}}
        <div class="login-page__modal-space login-page__modal-space_signup"></div>
        {{{SignUpBtn}}}
        {{{SignInBtn}}}
    </div>
    {{{modalMessage}}}
</div>`;
  }
}

const mapStateToProps = state => state.signupPage;

export default connect(mapStateToProps)(SignUpPage);
