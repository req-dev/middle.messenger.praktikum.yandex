// language=hbs
import Block, {blockProps} from '../../framework/Block';

interface ModalTitleProps extends blockProps {
  text: string
}

export default class ModalTitle extends Block<ModalTitleProps>{
  constructor(props: ModalTitleProps) {
    super({
      ...props,
      className: 'modal-title'
    }, 'h1');
  }

  render() {
    return `{{text}}`;
  }
}
