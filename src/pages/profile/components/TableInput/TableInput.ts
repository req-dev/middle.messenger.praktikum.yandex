// language=hbs
import Input from '../../../../components/Input';
import { InputProps } from '../../../../components/Input';

interface TableInputProps extends InputProps {
  hint: string,
}

export default class TableInput extends Input{
  constructor(props: TableInputProps) {
    super({
      ...props,
      className: 'profile-page__body-card-item-property',
    });
  }

  render() {
    return `<label for="{{id}}" class="profile-page__body-card-item-property-label">{{hint}}</label>
            <input type="{{type}}" id="{{id}}" name="{{name}}" placeholder="{{placeholder}}" value="{{value}}" title="{{errorText}}" class="profile-page__body-card-item-property-input{{#if errorText}} profile-page__body-card-item-property-input_red{{/if}}">`;
  }
}
