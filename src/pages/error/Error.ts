import Block, { blockProps } from '../../framework/Block';
import ButtonS from '../../components/ButtonS';
import Router, { Routes } from '../../framework/Router';

interface ErrorPageProps extends blockProps{
  code: string,
  codeDesc: string,
  message: string,
  ButtonS?: Block
}

export default class ErrorPage extends Block<ErrorPageProps> {

  router: Router;

  constructor(props: ErrorPageProps) {
    super({
      ...props,
      ButtonS: new ButtonS({
        text: 'Back to Chats',
        events: {
          click: () => this.router.go(Routes.Messenger)
        }
      })
    });

    this.router = new Router();
  }

  render() {
    return `
    <div class="error-page">
      <div class="error-page__card">
        <h1 class="error-page__code">{{code}}</h1>
        <h2 class="error-page__code-desc">{{codeDesc}}</h2>
        <h3 class="error-page__message">{{message}}</h3>
      </div>
      {{{ButtonS}}}
    </div>`;
  }
}
