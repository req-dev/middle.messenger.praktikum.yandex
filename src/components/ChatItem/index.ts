// language=hbs
import './style.pcss';

const ChatItem = `<div class="chat-item">
    <img src="{{src}}" class="chat-item__img" alt="{{name}} avatar">
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
    </div>
</div>`;
export default ChatItem;
