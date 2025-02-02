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
    return `<div class="profile-page__body-card-item-property-container">
                <label for="{{id}}" class="profile-page__body-card-item-property-label">{{hint}}</label>
                {{#if errorText}}
                    <label class="input__error">{{errorText}}</label>
                {{/if}}
            </div>
            <input type="{{type}}"
                   id="{{id}}"
                   name="{{name}}"
                   placeholder="{{placeholder}}"
                   value="{{value}}"
                   {{#if disabled}}disabled="true"{{/if}}
                   class="profile-page__body-card-item-property-input{{#if errorText}} profile-page__body-card-item-property-input_red{{/if}}">`;
  }
}
