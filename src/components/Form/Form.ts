// language=hbs
import './Form.pcss';
import Block, {blockProps} from '../../framework/Block';
import Input from '../Input';
import { ValidateFormController, IValidateFormResult } from '../../controllers/validate-form-controller';
import store from '../../framework/Store';

export interface IFormStateData {
  formErrors?: Record<string, string>;
  disabled?: boolean,
  generalFormError?: string,
}

interface props extends blockProps {
  onSubmit?: (result: IValidateFormResult) => void,
  childrenList: { inputs: Input[]; } & Record<string, Block[]>,
  statePath: string
}

export type FormProps = props & IFormStateData;

export default class Form extends Block<FormProps>{
  private validateFormController: ValidateFormController;

  constructor(props: FormProps) {
    super({
      ...props,
      events: {
        ...props.events,
        submit: (e: Event) => {
          e.preventDefault();
          this.submit();
        }
      }
    }, 'form');
    this.validateFormController = new ValidateFormController(
      props.statePath
    );
  }

  componentDidMount() {
    // add additional validation on blur event
    for (const input of Object.values(this.props.childrenList.inputs)){
      input.setProps({
        events: {
          ...input.props.events,
          blur: () => this.validate()
        }
      });
    }

    this.updateInputs();
  }

  getData(): Record<string, string> {
    const data: Record<string, string> = {};
    const inputs = Object.values(this.props.childrenList.inputs);

    for (const input of inputs) {
      const name = input.props.name;
      data[name] = (input.targetElement as HTMLInputElement).value;
    }

    return data;
  }

  getFormData(): FormData {
    const element = this.getContent() as HTMLFormElement;
    return new FormData(element);
  }

  clear() {
    const inputs = Object.values(this.props.childrenList.inputs);
    for (const input of inputs) {
      input.setValue('');
    }

    store.set(`${this.props.statePath}`, {
      generalFormError: ''
    });
    this.validateFormController.clearErrors();
  }

  validate() {
    return this.validateFormController.validate(this.getData());
  }

  submit(){
    if (this.props.disabled){
      return;
    }
    const result = this.validate();
    if (!result.isCorrect) return;

    if (this.props?.onSubmit) {
      this.props.onSubmit(result);
    }
  }

  componentDidUpdate(oldProps: FormProps): boolean {
    this.updateInputs();
    return super.componentDidUpdate(oldProps);
  }

  public setValues(data: Record<string, string>) {
    for (const input of Object.values(this.props.childrenList.inputs)) {
      const inputName = input.props.name;
      if (data[inputName]){
        input.setValue(data[inputName]);
      }
    }
  }

  private updateInputs(){
    // assign error texts to their Inputs
    const formErrors = this.props.formErrors ?? {};

    for (const input of Object.values(this.props.childrenList.inputs)) {
      let errorText = '';
      if (Object.keys(formErrors).includes(input.props.name)){
        errorText = formErrors[input.props.name];
      }

      input.setProps({
        errorText,
        disabled: Boolean(this.props.disabled)
      });
    }
  }

  render() {
    return `
    <input type="submit" value="submit" hidden>
    {{{inputs}}}
    {{#if generalFormError}}
        <span class="form-common__error-message">{{generalFormError}}</span>
    {{/if}}
    `;
  }
}
