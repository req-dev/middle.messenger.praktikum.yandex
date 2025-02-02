import './Header.pcss';
import Block, { blockProps } from '../../../../framework/Block';
import connect from '../../../../framework/connectStore';
import ChatOptionsButton from './components/ChatOptionsButton';
import Submenu from '../../../../components/Submenu';
import SubmenuButton from '../../../../components/SubmenuButton';
import store, { IAppState } from '../../../../framework/Store';

interface HeaderProps extends blockProps {
  avatar?: string | null,
  name?: string,
  submenuOpened?: boolean
}

class Header extends Block<HeaderProps> {
  submenu: Submenu;
  constructor() {
    super({
      avatar: null,
      name: '',
      className: 'chats-page__dialog-area-header',

      submenu: new Submenu({
        statePath: 'chatsPage.header.submenuOpened',
        childrenList: {
          options: [
            new SubmenuButton({
              text: 'Add a User',
              icon: 'icons/AddUserSubmenuButton.svg',
              events: {
                click: () => {
                  this.submenu.close();
                  store.set('chatsPage.addUserModal.visible', true);
                }
              }
            }),
            new SubmenuButton({
              text: 'Delete User',
              icon: 'icons/DeleteUserSubmenuButton.svg',
              events: {
                click: () => {
                  this.submenu.close();
                  store.set('chatsPage.deleteUserModal.visible', true);
                }
              }
            }),
            new SubmenuButton({
              text: 'Delete Chat',
              icon: 'icons/DeleteChatSubmenuButton.svg',
              events: {
                click: () => {
                  this.submenu.close();
                  store.set('chatsPage.deleteChatModal.visible', true);
                }
              }
            }),
          ]
        }
      }),
      chatOptionsButton: new ChatOptionsButton({
        events: {
          click: () => this.props.submenuOpened ? this.submenu.close() : this.submenu.open()
        }
      }),
    }, 'header');
  }

  componentDidMount() {
    this.submenu = this.children['submenu'] as Submenu;
  }

  componentDidUpdate(oldProps: HeaderProps) {
    this.submenu.setProps({ opened: Boolean(this.props.submenuOpened) });
    return super.componentDidUpdate(oldProps);
  }

  render() {
    return `<img src="{{#if avatar}}{{avatar}}{{else}}https://avatar.iran.liara.run/public{{/if}}" class="chats-page__dialog-area-header-avatar" alt="avatar">
            <h1 class="chats-page__dialog-area-header-name">{{name}}</h1>
            <div class="chats-page__dialog-area-header-options-submenu-container">
                {{{chatOptionsButton}}}
                {{{submenu}}}
            </div>
    `;
  }
}

const mapStateToProps = (state: IAppState) => state.chatsPage.header;

export default connect<HeaderProps>(mapStateToProps)(Header);
