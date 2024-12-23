// language=hbs
import Block, {blockProps} from '../../framework/Block';
import Input from '../Input';
import { ValidateForm, IValidateFormResult } from '../../unitilies/ValidateForm';

interface FormProps extends blockProps {
  onSubmit?: (result: IValidateFormResult) => void,
  childrenList: { inputs: Block<blockProps>[]; } & Record<string, Block<blockProps>[]>,
  disabled?: boolean,
}

export default class Form extends Block<FormProps>{
  public ValidateForm: ValidateForm;

  constructor(props: FormProps) {
    super('form', {
      ...props,
      events: {
        ...props.events,
        submit: (e: Event) => {
          e.preventDefault();
          this.submit();
        }
      }
    });
    this.ValidateForm = new ValidateForm(
      this.getContent() as HTMLFormElement,
      Object.values(this.children) as unknown as Input[]
    );
  }

  submit(){
    const checkResult = this.checkForm();
    if (!checkResult.valid) return;

    if (this.props?.onSubmit) {
      this.props.onSubmit(checkResult);
    }
  }

  checkForm(){
    return this.ValidateForm.check();
  }

  componentDidMount() {
    Object.values(this.children).forEach((child: Block) => {
      child.setProps({
        events: {
          ...child.props.events,
          blur: () => this.checkForm()
        }
      });
    });
  }

  render() {
    return `
    <input type="submit" value="submit" hidden>
    {{{inputs}}}
    `;
  }
}
