import Block, { blockProps } from '../../framework/Block';
import ButtonS from '../../components/ButtonS';

interface ErrorPageProps extends blockProps{
  code: string,
  codeDesc: string,
  message: string,
  toMainPage: () => void
  ButtonS?: Block
}

export default class ErrorPage extends Block<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super('div', {
      ...props,
      className: 'error-page',
      ButtonS: new ButtonS({
        text: 'Back to Chats',
        events: {
          click: props.toMainPage
        }
      })
    });
  }
  render() {
    return `<div class="error-page__card">
        <h1 class="error-page__code">{{code}}</h1>
        <h2 class="error-page__code-desc">{{codeDesc}}</h2>
        <h3 class="error-page__message">{{message}}</h3>
    </div>
    {{{ButtonS}}}`;
  }
}
