import Block, { blockProps } from '../../framework/Block';
import ModalTitle from '../../components/ModalTitle';
import Form, { IFormStateData } from '../../components/Form';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { SignupFormModel } from '../../api/signup-api';
import UserSignupController from '../../controllers/user-signup-controller';

import connect from '../../framework/connectStore';
import Router from '../../framework/Router';
import ModalMessage from '../../components/ModalMessage';
import { IAppState } from '../../framework/Store';
import UserSessionController from '../../controllers/user-session-controller';

interface SignUpProps extends blockProps{
  modalMessage?: Block,
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
  userSessionController: UserSessionController;

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
            }),
            new Input({
              hint: 'Login',
              type: 'text',
              placeholder: 'ivanivanov',
              name: 'login',
              id: 'loginInput',
            }),
            new Input({
              hint: 'First name',
              type: 'text',
              placeholder: 'ivan',
              name: 'first_name',
              id: 'firstNameInput',
            }),
            new Input({
              hint: 'Second name',
              type: 'text',
              placeholder: 'ivanov',
              name: 'second_name',
              id: 'secondNameInput',
            }),
            new Input({
              hint: 'Phone',
              type: 'tel',
              placeholder: '+7 (909) 967 30 30',
              name: 'phone',
              id: 'phoneInput',
            }),
            new Input({
              hint: 'Password',
              type: 'password',
              placeholder: '••••••••••••',
              name: 'password',
              id: 'passwordInput',
            }),
            new Input({
              hint: 'Password again',
              type: 'password',
              placeholder: '•••••••••••',
              name: 'password_repeat',
              id: 'passwordAgainInput',
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
    this.userSessionController = new UserSessionController();
    this.userSessionController.getUser();
  }

  componentDidMount() {
    this.form = this.children['form'] as unknown as Form;
    this.signInBtn = this.children['SignInBtn'] as unknown as Button;
    this.signUpBtn = this.children['SignUpBtn'] as unknown as Button;

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
    this.userSignupController.signup(this.form.getData() as unknown as SignupFormModel);

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

const mapStateToProps = (state: IAppState) => state.signupPage;

export default connect<SignUpProps>(mapStateToProps)(SignUpPage);
