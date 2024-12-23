// language=hbs
import Block, { blockProps } from '../../../../framework/Block';

export default class SendButton extends Block<blockProps>{
  constructor(props?: blockProps) {
    super('button', {
      ...props,
      className: 'chats-page__dialog-area-reply-box-send-btn'
    });
  }
  render() {
    return `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>`;
  }
}
