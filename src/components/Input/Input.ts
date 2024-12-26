// language=hbs
import Block, {blockProps} from '../../framework/Block';

export interface InputProps extends blockProps {
  hint?: string,
  type: 'text' | 'password' | 'email' | 'tel',
  placeholder: string,
  name: string,
  id: string,
  errorText?: string,
  value?: string,
}


export class Input extends Block<InputProps>{
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
        change: (e: InputEvent) => {
          const target = (e.target as HTMLInputElement);
          this.props.value = target.value;
        },
      }
    });
  }

  componentDidUpdate(oldProps: InputProps): boolean {
    // TODO review
    // block will rerender only if error text changes
    const oldEventsLength = oldProps.events ? Object.keys(oldProps.events).length : 0;
    const eventsLength = this.props.events ? Object.keys(this.props.events).length : 0;
    return oldProps?.errorText != this.props?.errorText || oldEventsLength !== eventsLength;
  }

  render() {
    return `
    {{#if hint}}
        <label for="{{id}}" class="input__hint">{{hint}}</label>
    {{/if}}
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
