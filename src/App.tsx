import Handlebars from 'handlebars';
import * as Pages from './pages';
import '../global.pcss';

//register partials
import ButtonS from "./components/ButtonS";
import ModalTitle from "./components/ModalTitle";
import Input from "./components/Input";
import { Button, ButtonDark } from "./components/Button";

Handlebars.registerPartial('ButtonS', ButtonS);
Handlebars.registerPartial('ModalTitle', ModalTitle);
Handlebars.registerPartial('Input', Input);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('ButtonDark', ButtonDark);

export default class App{
    private state: { currentPage: string };
    private rootElement: HTMLElement;

    constructor(rootElement: HTMLElement) {
        this.state = {
            currentPage:'signup'
        }
        this.rootElement = rootElement;
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
            case '500':
                template = Pages.errorPageTemplate;
                values = {
                    code:500,
                    codeDesc:'Internal Server Error',
                    message:'We’re already working on it'
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