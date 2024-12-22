import * as Pages from './pages';
import '../global.pcss';
import Block from './framework/Block';

const pages = [
  'login', 'signup', 'chats', 'profileMain', '500', '404',
];

export default class App {
  private state: { currentPage: string };
  private pageBlock?: Block;

  private rootElement: HTMLElement;

  constructor(rootElement: HTMLElement) {
    this.state = {
      currentPage: document.location.pathname.replace('/', ''),
    };
    this.rootElement = rootElement;
    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        const current = pages.indexOf(this.state.currentPage);
        let next = pages[current + 1];
        if (current >= pages.length - 1) {
          next = pages[0];
        }
        this.state.currentPage = next;
        history.pushState(null, '', next);
        this.render(this.state.currentPage);
      }
    });
  }

  render(subject: string) {
    switch (subject) {
      case 'login':
        this.pageBlock = new Pages.SignInPage();
        break;
      case 'signup':
        this.pageBlock = new Pages.SignUpPage();
        break;
      case 'chats':
        this.pageBlock = new Pages.ChatsPage();
        break;
      case 'profileMain':
        this.pageBlock = new Pages.ProfilePage();
        break;
      case '500':
        this.pageBlock = new Pages.ErrorPage({
          code: '500',
          codeDesc: 'Internal Server Error',
          message: 'We are already working on it',
          toMainPage: () => this.render('chats')
        });
        break;
      default:
        this.pageBlock = new Pages.ErrorPage({
          code: '404',
          codeDesc: 'Not Found',
          message: 'It seems like you lost',
          toMainPage: () => this.render('chats')
        });
    }

    if (!this.rootElement.firstChild){
      this.rootElement.appendChild(document.createElement('div'));
    }
    this.rootElement.firstChild.replaceWith(this.pageBlock.getContent());
    this.pageBlock.dispatchComponentDidMount();
  }
}
