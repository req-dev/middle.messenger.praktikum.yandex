// language=hbs
import Block, {blockProps} from '../../framework/Block';
import isEqual from '../../unitilies/isEqual';

export interface InputProps extends blockProps {
  hint?: string,
  type: 'text' | 'password' | 'email' | 'tel' | 'file',
  placeholder?: string,
  name: string,
  id: string,
  accept?: string,
  errorText?: string,
  value?: string,
  disabled?: boolean
}


export class Input extends Block<InputProps>{
  private files: FileList | null;
  private value: string = '';

  constructor(props: InputProps) {
    super({
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
          // In case of rerender value will not be lost
          const input = (e.target as HTMLInputElement);
          if (this.props.type === 'file') {
            this.files = input.files;
          } else {
            this.value = input.value;
          }
        },
      }
    });

    this.value = props.value ?? '';
    this.files = null;
  }

  componentDidMount() {
    this.restoreValues();
  }

  componentDidUpdate(oldProps: InputProps): boolean {
    // I excluded 'events' and 'value' properties from comparison
    // Otherwise component would be corrupted due to rerender on every letter type or event adding
    const oldEventsLength = oldProps.events ? Object.keys(oldProps.events).length : 0;
    const eventsLength = this.props.events ? Object.keys(this.props.events).length : 0;

    oldProps = { ...oldProps, events: {}, value: '' };
    const newProps = { ...this.props, events: {}, value: '' };

    return !isEqual(oldProps, newProps) || oldEventsLength !== eventsLength;
  }

  setValue(value: string) {
    if (this.props.type === 'file') {
      return;
    }
    const target = (this.targetElement as HTMLInputElement);
    this.value = value;
    target.value = value;
  }

  clear() {
    this.files = null;
    this.value = '';
    this.restoreValues();
  }

  componentAfterUpdate() {
    this.restoreValues();
  }

  private restoreValues() {
    const input = (this.targetElement as HTMLInputElement);
    if (this.props.type === 'file') {
      if (this.files) {
        input.files = this.files;
      }
    } else {
      input.value = this.value;
    }
  }

  render() {
    return `
    {{#if hint}}
        <label for="{{id}}" class="input__hint">{{hint}}</label>
    {{/if}}
    <input type="{{type}}"
           {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
           name="{{name}}"
           class="input__input{{#if errorText}} input__input_error{{/if}}"
           id="{{id}}"
           {{#if accept}}accept="{{accept}}"{{/if}}
           {{#if disabled}}disabled="true"{{/if}}>
    {{#if errorText}}
        <label class="input__error">{{errorText}}</label>
    {{/if}}`;
  }
}
