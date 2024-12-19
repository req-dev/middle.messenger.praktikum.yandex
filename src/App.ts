import * as Pages from './pages';
import '../global.pcss';

const pages = [
  'login', 'signup', 'chats', 'profileMain', 'profileEdit', 'profileEditPassword', '500', '404',
];

export default class App {
  private state: { currentPage: string };

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
    let page;
    switch (subject) {
      case 'login':
        page = new Pages.SignInPage();
        break;
      case 'signup':
        page = new Pages.SignUpPage();
        break;
      case 'chats':
        page = new Pages.ChatsPage();
        break;
      case 'profileMain':
        page = Pages.profileMain;
        break;
      case 'profileEdit':
        page = Pages.profileEdit;
        break;
      case 'profileEditPassword':
        page = Pages.profileEditPassword;
        break;
      case '500':
        page = new Pages.ErrorPage({
          code: '500',
          codeDesc: 'Internal Server Error',
          message: 'We are already working on it',
          toMainPage: () => this.render('chats')
        });
        break;
      default:
        page = new Pages.ErrorPage({
          code: '404',
          codeDesc: 'Not Found',
          message: 'It seems like you lost',
          toMainPage: () => this.render('chats')
        });
    }
    this.rootElement.replaceWith(page.getContent());
  }
}
