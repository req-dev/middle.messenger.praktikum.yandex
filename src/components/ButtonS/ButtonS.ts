// language=hbs
import Block, {blockProps} from '../../framework/Block';

interface ButtonProps extends blockProps {
  text: string,
}

export default class Button extends Block<ButtonProps>{
  constructor(props: ButtonProps) {
    super('button', {
      ...props,
      className: 'button-small'
    });
  }
  render() {
    return `{{text}}`;
  }
}
