// language=hbs
import Input from '../../../../components/Input';
import { blockProps } from '../../../../framework/Block';


export class MessageInput extends Input{
  constructor(props?: blockProps) {
    super({
      ...props,
      className: 'chats-page__dialog-area-reply-box-msg-form-input-wrapper',
      type: 'text',
      name: 'message',
      placeholder: 'Write a message...',
      id: 'messageInput'
    });
  }

  render() {
    return `
    <input type="{{type}}"
           placeholder="{{placeholder}}"
           name="{{name}}"
           class="input__input chats-page__dialog-area-reply-box-msg-form-input"
           id="{{id}}"
           value="{{value}}">`;
  }
}
