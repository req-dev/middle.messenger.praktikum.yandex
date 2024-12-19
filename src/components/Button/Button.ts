// language=hbs
import Block, {blockProps} from '../../framework/Block';

interface ButtonProps extends blockProps {
  text: string,
  darkMode?: boolean,
}

export default class Button extends Block<ButtonProps>{
  constructor(props: ButtonProps) {
    const className = `button ${props.darkMode ? 'button_dark' : ''}`;
    super('button', {
      ...props,
      className
    });
  }
  render() {
    return `{{text}}`;
  }
}
