// language=hbs
import Block, {blockProps} from '../../framework/Block';

interface InputProps extends blockProps {
  hint: string,
  type: 'text' | 'password' | 'email' | 'tel',
  placeholder: string,
  name: string,
  id: string,
  errorText?: string,
  value?: string,
}

export default class Input extends Block<InputProps>{
  constructor(props: InputProps) {
    super('div', {
      ...props,
      settings: {
        withInternalID: true,
        targetElementForEvents: 'input'
      },
      attr: {
        class: 'input',
        id: props.id
      },
      events: {
        ...props.events,
        change: (e: Event) => {
          this.props.value = e.target.value;
        },
      }
    });
  }

  componentDidUpdate(oldProps?: InputProps): boolean {
    // TODO review
    // block will rerender only if error text changes
    const oldEventsLenght = Object.keys(oldProps!.events).length;
    const eventsLenght = Object.keys(this.props!.events).length;
    return oldProps?.errorText != this.props?.errorText || oldEventsLenght !== eventsLenght;
  }

  render() {
    return `
    <label for="{{id}}" class="input__hint">{{hint}}</label>
    <input type="{{type}}"
           placeholder="{{placeholder}}"
           name="{{name}}"
           class="input__input{{#if errorText}} input__input_error{{/if}}"
           id="{{id}}"
           value="{{value}}">
    {{#if errorText}}
        <label class="input__error">{{errorText}}</label>
    {{/if}}`;
  }
}
