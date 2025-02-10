import Block, { blockProps } from '../../../../framework/Block';
import connect from '../../../../framework/connectStore';
import { ChatListItemModel } from '../../../../types/data';
import ChatItem from '../../../../components/ChatItem';
import isEqual from '../../../../unitilies/isEqual';
import Store, { IAppState } from '../../../../framework/Store';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import DialogController from '../../../../controllers/dialog-controller';
import formatDate from '../../../../unitilies/formatDate';

interface ChatsListSidebarProps extends blockProps {
  chatList?: ChatListItemModel[] | null,
  selectedChat?: number | null,
  childrenList?: { chatsList: ChatItem[]; } & Record<string, Block[]>,
  gotChats?: boolean, // local state, if false shows spinner
}

class ChatsListSidebar extends Block<ChatsListSidebarProps> {
  dialogController: DialogController;
  store: Store;

  constructor(props?: ChatsListSidebarProps) {
    super({
      ...props,
      loadingSpinner: new LoadingSpinner(),

      className: 'chats-page__sidebar-chats-list',
      chatList: null,
      selectedChat: null,
      gotChats: false,
      childrenList: {
        chatsList: []
      }
    });

    this.store = new Store();
    this.dialogController = new DialogController();
  }

  componentDidUpdate(oldProps: ChatsListSidebarProps): boolean {
    const chatList = this.props.chatList ?? [];
    const chatListChanged = !isEqual(oldProps.chatList ?? [], chatList);
    const myUserId = this.store.getState().user?.id;

    if (Boolean(this.props.chatList) != this.props.gotChats) {
      this.setProps({ gotChats: Boolean(this.props.chatList) });
    }

    if (chatListChanged) {
      // updates components from the received list
      const dialogs: ChatItem[] = [];
      for (const chatItem of chatList) {
        dialogs.push(new ChatItem({
          src: chatItem.avatar ?? 'https://avatar.iran.liara.run/public',
          name: chatItem.title,
          datestamp: chatItem.last_message?.time ? formatDate(chatItem.last_message.time, 'DD.MM'): '',
          message: chatItem.last_message?.content ?? 'Chat has been created',
          addMePrefix: Boolean(chatItem.last_message?.user == myUserId),
          counter: chatItem.unread_count,
          id: chatItem.id,
          selected: chatItem.id === this.props.selectedChat,
          events: {
            click: () => this.chatClicked(chatItem.id)
          }
        }));
      }

      this.setProps({ childrenList: { chatsList: dialogs } });
    } else {
      // updates only selected state
      this.updateChatsSelecting();
    }
    return super.componentDidUpdate(oldProps);
  }

  async chatClicked(id: number) {
    if (!this.dialogController.canDisconnect || id === this.props.selectedChat) {
      return;
    }
    const chatList = this.props.chatList ?? [];
    const chat = chatList.find(el => el.id === id);

    this.store.set('chatsPage', {
      selectedChat: id,
      header: {
        avatar: chat?.avatar ?? null,
        name: chat?.title ?? '',
      }
    });
    this.updateChatsSelecting();
    await this.dialogController.disconnect();
    await this.dialogController.createWSConnection(id);
  }

  private updateChatsSelecting() {
    const selectedChat = this.props.selectedChat;
    const chatsList = this.props.childrenList?.chatsList ?? [];

    for (const chatItem of chatsList) {
      chatItem.setProps({ selected: chatItem.props.id === selectedChat });
    }
  }

  render() {
    return `
    {{#if gotChats}}
          {{{chatsList}}}
    {{else}}
          {{{loadingSpinner}}}
    {{/if}}
    `;
  }
}

const mapStateToProps = (state: IAppState) => state.chatsPage;

export default connect(mapStateToProps)(ChatsListSidebar);
