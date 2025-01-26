// language=hbs
import Block, {blockProps} from '../../framework/Block';

interface ChatItemProps extends blockProps {
  src: string,
  name: string,
  datestamp: string,
  message: string,
  addMePrefix?: boolean
  counter?: number
}

export default class ChatItem extends Block<ChatItemProps>{
  constructor(props: ChatItemProps) {
    super({
      ...props,
      className: 'chat-item'
    });
  }
  render() {
    return `<img src="{{src}}" class="chat-item__img" alt="{{name}} avatar">
    <div class="chat-item__body">
        <div class="chat-item__body-top">
            <div class="chat-item__body-top-name">{{name}}</div>
            <div class="chat-item__body-top-datestamp">{{datestamp}}</div>
        </div>
        <div class="chat-item__body-bottom">
            <div class="chat-item__body-bottom-message">
                {{#if addMePrefix}}
                    <span class="chat-item__body-bottom-message-prefix">You: </span>
                {{/if}}
                {{message}}</div>
            {{#if counter}}
                <div class="chat-item__body-bottom-counter">{{counter}}</div>
            {{/if}}
        </div>
    </div>`;
  }
}
