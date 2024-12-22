// language=hbs
import Block, {blockProps} from '../../../../framework/Block';

interface TableInputProps extends blockProps {
  hint: string,
  type: 'text' | 'password' | 'email' | 'tel',
  placeholder: string,
  name: string,
  id: string,
  value?: string,
}

export default class TableInput extends Block<TableInputProps>{
  constructor(props: TableInputProps) {
    super('div', {
      ...props,
      attr: {
        class: 'profile-page__body-card-item-property',
        id: props.id
      }
    });
  }
  render() {
    return `<label for="{{id}}" class="profile-page__body-card-item-property-label">{{hint}}</label>
            <input type="{{type}}" id="{{id}}" name="{{name}}" placeholder="{{placeholder}}" value="{{value}}" class="profile-page__body-card-item-property-input">`;
  }
}
