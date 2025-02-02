import Block, { blockProps } from '../../framework/Block';
import ModalTitle from '../../components/ModalTitle';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Form, { IFormStateData } from '../../components/Form';
import connect from '../../framework/connectStore';
import Router from '../../framework/Router';
import UserLoginController from '../../controllers/user-login-controller';
import { LoginFormModel } from '../../api/login-api';
import ModalMessage from '../../components/ModalMessage';
import { IAppState } from '../../framework/Store';

interface SignInProps extends blockProps{
  modalMessage?: Block,
  ModalTitle?: ModalTitle,
  form?: Form,
  SignInBtn?: Button,
  SignUpBtn?: Button,
  FormStateData?: IFormStateData
}

class SignInPage extends Block<SignInProps> {

  form: Form;
  signInBtn: Button;
  signUpBtn: Button;
  router: Router;
  userLoginController: UserLoginController;

  constructor(props?: SignInProps) {
    super({
      ...props,
      modalMessage: new ModalMessage(),
      ModalTitle: new ModalTitle({
        text: 'Log in'
      }),

      form: new Form({
        ...props?.FormStateData,
        statePath: 'signinPage.FormStateData',
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
          click: () => this.form.submit()
        }
      }),
      SignUpBtn: new Button({
        text: 'Create account',
        darkMode: true,
        attr: { id: 'signupBtn' },
        events: {
          click: () => this.router.go('/sign-up')
        }
      })
    });

    this.router = new Router();
    this.userLoginController = new UserLoginController();
  }

  componentDidMount() {
    this.form = this.children['form'] as unknown as Form;
    this.signInBtn = this.children['SignInBtn'] as unknown as Button;
    this.signUpBtn = this.children['SignUpBtn'] as unknown as Button;

    this.form.setProps({
      onSubmit: () => this.submitted()
    });
  }

  componentDidUpdate(oldProps: SignInProps): boolean {
    this.form.setProps({ ...this.props?.FormStateData });
    this.signInBtn.setProps({
      disabled: this.props?.FormStateData?.disabled,
      loading: this.props?.FormStateData?.disabled,
    });
    this.signUpBtn.setProps({
      disabled: this.props?.FormStateData?.disabled,
    });
    return super.componentDidUpdate(oldProps);
  }

  submitted(){
    this.userLoginController.login(this.form.getData() as unknown as LoginFormModel);
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
    {{{modalMessage}}}
</div>`;
  }
}

const mapStateToProps = (state: IAppState) => state.signinPage;

export default connect<SignInProps>(mapStateToProps)(SignInPage);
