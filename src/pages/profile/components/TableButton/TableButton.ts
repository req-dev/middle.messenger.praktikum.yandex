// language=hbs
import Block, {blockProps} from '../../../../framework/Block';

interface TableButtonProps extends blockProps {
  text: string,
  red?: boolean
}

export default class TableButton extends Block<TableButtonProps>{
  constructor(props: TableButtonProps) {
    super('button', {
      ...props,
      className: `profile-page__body-card-item-property-btn ${props.red ? 'profile-page__body-card-item-property-btn_red' : 'profile-page__body-card-item-property-btn_green' }`
    });
  }
  render() {
    return `{{text}}`;
  }
}
