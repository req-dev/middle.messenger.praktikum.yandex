// language=hbs
import Block, {blockProps} from '../../framework/Block';

interface ArrowButtonProps extends blockProps {
  text?: string,
}

class ArrowButton extends Block<ArrowButtonProps> {
  constructor(props?: ArrowButtonProps) {
    super({
      ...props,
      className: 'arrow-button'
    }, 'button');
  }
  render() {
    return `<span>{{text}}</span>
            <svg class="arrow-button__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#238636"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>`;
  }
}

export default ArrowButton;
