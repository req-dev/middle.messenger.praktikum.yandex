import Handlebars from 'handlebars';
import * as Pages from './pages';
import '../global.pcss';

//register partials
import ButtonS from "./components/ButtonS";
import ModalTitle from "./components/ModalTitle";
import Input from "./components/Input";
import { Button, ButtonDark } from "./components/Button";
import ChatItem from "./components/ChatItem";

Handlebars.registerPartial('ButtonS', ButtonS);
Handlebars.registerPartial('ModalTitle', ModalTitle);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('ButtonDark', ButtonDark);
Handlebars.registerPartial('ChatItem', ChatItem);

const pages = ['login','signup','chats','profileMain','profileEdit','profileEditPassword','500','404'];

export default class App{
    private state: { currentPage: string };
    private rootElement: HTMLElement;

    constructor(rootElement: HTMLElement) {
        this.state = {
            currentPage:'login'
        }
        this.rootElement = rootElement;
        document.addEventListener('keyup', (e)=>{
            if (e.code === 'Space' || e.code === 'ArrowRight') {
                const current = pages.indexOf(this.state.currentPage);
                let next = pages[current+1];
                if (current>=pages.length-1){
                    next = pages[0];
                }
                this.state.currentPage = next;
                this.render();
            }
        });
    }

    render(){
        let template;
        let values;
        switch (this.state.currentPage) {
            case 'login':
                template = Pages.loginPage;
                break;
            case 'signup':
                template = Pages.signupPage;
                break;
            case 'chats':
                template = Pages.chatsPage;
                break;
            case 'profileMain':
                template = Pages.profileMain;
                break;
            case 'profileEdit':
                template = Pages.profileEdit;
                break;
            case 'profileEditPassword':
                template = Pages.profileEditPassword;
                break;
            case '500':
                template = Pages.errorPageTemplate;
                values = {
                    code:500,
                    codeDesc:'Internal Server Error',
                    message:'We are already working on it'
                };
                break;
            default:
                template = Pages.errorPageTemplate;
                values = {
                    code:404,
                    codeDesc:'Not Found',
                    message:'It seems like you lost'
                };
        }
        template = Handlebars.compile(template);
        this.rootElement.innerHTML = template(values);
    }
}