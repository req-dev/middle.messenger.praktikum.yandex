// language=hbs
import Block, {blockProps} from '../../framework/Block';

interface InputProps extends blockProps {
  hint: string,
  type: 'text' | 'password' | 'email' | 'tel',
  placeholder: string,
  name: string,
  id: string,
  errorText?: string,
}

export default class Input extends Block<InputProps>{
  constructor(props: InputProps) {
    super('div', {
      ...props,
      attr: {
        class: 'input',
        id: props.id
      }
    });
  }
  render() {
    return `
    <label for="{{id}}" class="input__hint">{{hint}}</label>
    <input type="{{type}}"
           placeholder="{{placeholder}}"
           name="{{name}}"
           class="input__input{{#if errorText}} input__input_error{{/if}}"
           id="{{id}}">
    {{#if errorText}}
        <label class="input__error">{{errorText}}</label>
    {{/if}}`;
  }
}
