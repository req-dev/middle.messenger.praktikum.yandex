import Block, { blockProps } from '../../../../framework/Block';
import connect from '../../../../framework/connectStore';
import { ChatListItemModel } from '../../../../types/data';
import ChatItem from '../../../../components/ChatItem';
import isEqual from '../../../../unitilies/isEqual';
import store from '../../../../framework/Store';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import DialogController from '../../../../controllers/dialog-controller';

interface ChatsListSidebarProps extends blockProps {
  chatList?: ChatListItemModel[] | null,
  selectedChat: number | null,
  childrenList: { chatsList: ChatItem[]; } & Record<string, Block[]>,
  gotChats: boolean, // local state, if false shows spinner
}

class ChatsListSidebar extends Block<ChatsListSidebarProps> {
  dialogController: DialogController;
  scroll: number = 0;

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

    this.dialogController = new DialogController();
  }

  componentDidUpdate(oldProps: ChatsListSidebarProps): boolean {
    const chatList = this.props.chatList ?? [];
    const chatListChanged = !isEqual(oldProps.chatList ?? [], chatList);

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
          datestamp: chatItem.last_message?.time ?? '', // TODO fix, should display time
          message: chatItem.last_message?.content ?? 'Chat has been created',
          addMePrefix: false, // TODO fix with proper check
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

  chatClicked(id: number) {
    store.set('chatsPage.selectedChat', id);
    this.updateChatsSelecting();
  }

  updateChatsSelecting() {
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

const mapStateToProps = state => state.chatsPage;

export default connect(mapStateToProps)(ChatsListSidebar);
