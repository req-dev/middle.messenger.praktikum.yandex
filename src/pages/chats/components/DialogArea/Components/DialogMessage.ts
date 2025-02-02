import './DialogMessage.pcss';
import Block, { blockProps } from '../../../../../framework/Block';

interface DialogMessageProps extends blockProps {
  text?: string,
  date?: string,
  fromMe?: boolean
}

export default class DialogMessage extends Block<DialogMessageProps> {
  constructor(props?: DialogMessageProps) {
    super({
      ...props,
      className: 'chats-page__dialog-area-msgs-message-container'
    });
  }

  render() {
    return `<div class="chats-page__dialog-area-msgs-message{{#if fromMe}} chats-page__dialog-area-msgs-message_from-me{{/if}}">
                <div class="chats-page__dialog-area-msgs-message-text">{{text}}</div>
                <svg class="chats-page__dialog-area-msgs-message-read-mark" width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg"><line y1="-0.5" x2="3.765" y2="-0.5" transform="matrix(0.705933 0.708278 -0.705933 0.708278 0.700195 2.33313)" stroke="#238636"/><line y1="-0.5" x2="5.6475" y2="-0.5" transform="matrix(0.705933 -0.708278 0.705933 0.708278 3.35828 5)" stroke="#238636"/><line y1="-0.5" x2="5.6475" y2="-0.5" transform="matrix(0.705933 -0.708278 0.705933 0.708278 6.01587 5)" stroke="#238636"/></svg>
                <div class="chats-page__dialog-area-msgs-message-date">{{date}}</div>
            </div>`;
  }
}
