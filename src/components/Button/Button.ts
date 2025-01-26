// language=hbs
import Block, {blockProps} from '../../framework/Block';

interface ButtonProps extends blockProps {
  text: string,
  darkMode?: boolean,
  disabled?: boolean,
}

export default class Button extends Block<ButtonProps>{
  constructor(props: ButtonProps) {
    const className = `button ${props.darkMode ? 'button_dark' : ''}`;
    super({
      ...props,
      className,
      settings: {
        excludedAttributes: ['disabled', 'style']
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
    if (this.props.disabled){
      element.setAttribute('disabled', 'true');
      element.style.opacity = '0.3';
    } else {
      element.removeAttribute('disabled');
      element.style.opacity = '1';
    }
  }

  render() {
    return `{{text}}`;
  }
}
