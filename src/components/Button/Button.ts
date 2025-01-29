// language=hbs
import './Button.pcss';
import Block, {blockProps} from '../../framework/Block';
import LoadingSpinner from '../LoadingSpinner';

export interface ButtonProps extends blockProps {
  text: string,
  darkMode?: boolean,
  disabled?: boolean,
  loading?: boolean,
}

export default class Button<T extends ButtonProps> extends Block<T>{
  constructor(props: ButtonProps) {
    const className = `button ${props.darkMode ? 'button_dark' : ''}`;
    super({
      ...props,
      loadingSpinner: new LoadingSpinner(),
      settings: {
        excludedAttributes: ['disabled', 'style']
      },
      attr: {
        class: className,
      }
    }, 'button');
  }

  componentDidMount() {
    this.updateDisabledProperty();
  }

  componentDidUpdate(oldProps: ButtonProps): boolean {
    this.updateDisabledProperty();
    return super.componentDidUpdate(oldProps);
  }

  private updateDisabledProperty() {
    const element = this.getContent();
    if (this.props.disabled || this.props.loading){
      element.setAttribute('disabled', 'true');
      element.style.opacity = '0.3';
    } else {
      element.removeAttribute('disabled');
      element.style.opacity = '1';
    }
  }

  render() {
    return `
          {{#if loading}}
              {{{loadingSpinner}}}
          {{else}}
              {{text}}
          {{/if}}
          `;
  }
}
