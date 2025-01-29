import Block, { blockProps } from '../../framework/Block';
import Form, { IFormStateData } from '../../components/Form';
import MessageInput from './components/MessageInput';
import SendButton from './components/SendButton';
import Router from '../../framework/Router';
import ArrowButton from '../../components/ArrowButton';
import ModalMessage from '../../components/ModalMessage';
import ChatsController from '../../controllers/chats-controller';
import ChatsListSidebar from './components/ChatsListSidebar';
import connect from '../../framework/connectStore';
import AddButton from './components/AddButton';
import AddChatModal from './components/AddChatModal';
import store from '../../framework/Store';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ChatsPageProps extends blockProps{
  modalMessage: Block,
  loadingSpinner: LoadingSpinner,
  profileButton: ArrowButton,
  chatsListSidebar: Block,
  addButton: AddButton,
  messageForm: Form,
  messageFormData?: IFormStateData,

  sendButton: SendButton,

  addChatModal: Block
}

class ChatsPage extends Block<ChatsPageProps> {

  messageForm: Form;
  sendButton: SendButton;
  router: Router;
  addChatModal: Block;
  chatsController: ChatsController;

  constructor(props?: ChatsPageProps) {
    super({
      ...props,
      modalMessage: new ModalMessage(),
      loadingSpinner: new LoadingSpinner(),
      addChatModal: new AddChatModal(),

      profileButton: new ArrowButton({
        text: 'Profile',
        events: {
          click: () => this.router.go('/settings')
        }
      }),
      chatsListSidebar: new ChatsListSidebar(),
      addButton: new AddButton({
        events: {
          click: () => store.set('chatsPage.createChatModal.visible', true)
        }
      }),

      messageForm: new Form({
        className: 'chats-page__dialog-area-reply-box-msg-form',
        ...props?.messageFormData,
        statePath: 'chatsPage.messageFormData',
        onSubmit: () => this.messageSubmitted(),
        childrenList: {
          inputs: [
            new MessageInput()
          ]
        }
      }),

      sendButton: new SendButton({
        events: {
          click: () => this.messageForm.submit()
        }
      })
    });

    this.router = new Router();
    this.chatsController = new ChatsController();
  }

  componentDidMount() {
    this.messageForm = this.children['messageForm'] as Form;
    this.sendButton = this.children['sendButton'] as SendButton;
    this.addChatModal = this.children['addChatModal'];

    this.chatsController.getChats({});
  }

  componentDidUpdate(oldProps: ChatsPageProps): boolean {
    this.messageForm.setProps({ ...this.props.messageFormData });
    this.sendButton.setProps({ disabled: this.props.messageFormData?.disabled });
    return super.componentDidUpdate(oldProps);
  }

  messageSubmitted(){
    console.log(this.messageForm.getData());
  }

  render() {
    return `
    <div class="chats-page">
        <div class="chats-page__sidebar">
          {{{modalMessage}}}
          <div class="chats-page__sidebar-header">
              {{{profileButton}}}
              <input type="text" placeholder="Search" class="chats-page__sidebar-header-search">
          </div>
          {{{chatsListSidebar}}}
          {{{addButton}}}
          {{{addChatModal}}}
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
        </div>
    </div>`;
  }
}

const mapStateToProps = state => state.chatsPage;

export default connect(mapStateToProps)(ChatsPage);
