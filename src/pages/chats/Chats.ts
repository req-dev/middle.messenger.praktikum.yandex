import Block, { blockProps } from '../../framework/Block';
import ChatItem from '../../components/ChatItem';
import Form from '../../components/Form';
import MessageInput from './components/MessageInput';
import SendButton from './components/SendButton';
import { IValidateFormResult } from '../../unitilies/ValidateForm';

interface ChatsPageProps extends blockProps{
  messageForm: Form
}

const mockData = {
  chatsList: [
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Lucy Shtein',
      message: 'Hey there! Wanna make some money? Of course you do! Then come to our party with Tim Cook',
      datestamp: '10:49',
      counter: 1
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Bro',
      message: 'Also, the Weekend just dropped a new song, You gotta check it out!',
      datestamp: '10:13',
      counter: 4
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Andrew',
      message: 'Thanks',
      datestamp: '09:22',
      counter: 0,
      addMePrefix: true
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Design Destroyer',
      message: 'Guys I have an idea about out last project! We can paint the logo blue and add some minor changes',
      datestamp: '09:01',
      counter: 0,
      addMePrefix: true
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Medial Care bot',
      message: 'Reminder: You have an appointment at 17 p.m.',
      datestamp: 'Yesterday',
      counter: 9,
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'CIA Agent',
      message: 'Yes, I did',
      datestamp: 'Yesterday',
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Maria',
      message: 'Ok, take your time.',
      datestamp: 'Yesterday',
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Ben',
      message: 'Sorry, I forgot!',
      datestamp: 'Yesterday',
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Marinette',
      message: 'Sticker',
      datestamp: '22 sep',
      addMePrefix: true
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Oliver',
      message: 'I will call you',
      datestamp: '21 sep',
      addMePrefix: true
    }),
    new ChatItem({
      src: 'https://avatar.iran.liara.run/public',
      name: 'Oscar',
      message: 'Can you lend me some money?',
      datestamp: '21 sep',
      counter: 44,
    }),
  ]
};

export default class ChatsPage extends Block<ChatsPageProps> {

  messageForm: Form;
  sendButton: SendButton;

  constructor(props?: ChatsPageProps) {
    super('div', {
      ...props,
      className: 'chats-page',
      childrenList: { ...mockData },

      messageForm: new Form({
        className: 'chats-page__dialog-area-reply-box-msg-form',
        childrenList: {
          inputs: [
            new MessageInput()
          ]
        }
      }),

      sendButton: new SendButton()
    });
  }

  componentDidMount() {
    this.messageForm = this.children['messageForm'] as unknown as Form;
    this.sendButton = this.children['sendButton'] as unknown as Form;

    this.messageForm.setProps({
      onSubmit: this.messageSubmitted
    });
    this.sendButton.setProps({
      events: {
        click: () => this.messageSubmit()
      }
    });
  }

  messageSubmit(){
    this.messageForm.submit();
  }

  messageSubmitted(result: IValidateFormResult){
    console.log(Object.fromEntries(result.data.entries()));
  }

  render() {
    return `<div class="chats-page__sidebar">
        <div class="chats-page__sidebar-header">
            <button class="chats-page__sidebar-header-profile-btn">
                <span>Profile</span>
                <svg class="chats-page__sidebar-header-profile-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#238636"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
            </button>
            <input type="text" placeholder="Search" class="chats-page__sidebar-header-search">
        </div>
        <div class="chats-page__sidebar-chats-list">
            {{{chatsList}}}
        </div>
    </div>
    <div class="chats-page__dialog-area">
        <header class="chats-page__dialog-area-header">
            <img src="https://avatar.iran.liara.run/public" class="chats-page__dialog-area-header-avatar" alt="avatar">
            <h1 class="chats-page__dialog-area-header-name">Вадим</h1>
            <button class="chats-page__dialog-area-header-options-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="chats-page__dialog-area-header-options-btn-icon" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
            </button>
        </header>
        <div class="chats-page__dialog-area-msgs">
            <div class="chats-page__dialog-area-text">There will be messages later</div>
        </div>
        <div class="chats-page__dialog-area-reply-box">
            <button class="chats-page__dialog-area-reply-box-attach-btn">
                <svg viewBox="0 0 30 30" class="chats-page__dialog-area-reply-box-attach-btn-icon" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.18662 12.5L13.7628 4.92389L14.7056 5.8667L7.12943 13.4428L6.18662 12.5Z" fill="#848484"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.70067 15.014L16.2768 7.43781L17.2196 8.38062L9.64348 15.9568L8.70067 15.014Z" fill="#848484"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14.0433 20.3567L21.6195 12.7806L22.5623 13.7234L14.9861 21.2995L14.0433 20.3567Z" fill="#848484"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5574 22.8706L24.1335 15.2945L25.0763 16.2373L17.5002 23.8134L16.5574 22.8706Z" fill="#848484"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5574 22.8709C13.9423 25.486 9.71181 25.4954 7.10831 22.8919C4.50482 20.2884 4.51424 16.0579 7.12936 13.4428L6.18655 12.5C3.0484 15.6381 3.0371 20.7148 6.16129 23.839C9.28549 26.9632 14.3621 26.9518 17.5003 23.8137L16.5574 22.8709Z" fill="#848484"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21.6195 12.7806L22.5623 13.7234C25.003 11.2826 25.0118 7.3341 22.5819 4.90417C20.152 2.47424 16.2035 2.48303 13.7627 4.92381L14.7055 5.86662C16.6233 3.94887 19.7257 3.94196 21.6349 5.85119C23.5441 7.76042 23.5372 10.8628 21.6195 12.7806Z" fill="#848484"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.70092 15.0144C6.95751 16.7578 6.95123 19.5782 8.68689 21.3138C10.4226 23.0495 13.2429 23.0432 14.9863 21.2998L14.0435 20.357C12.8231 21.5774 10.8489 21.5818 9.63391 20.3668C8.41894 19.1518 8.42334 17.1776 9.64373 15.9572L8.70092 15.0144Z" fill="#848484"/></svg>
            </button>
            {{{messageForm}}}
            {{{sendButton}}}
        </div>
    </div>`;
  }
}
