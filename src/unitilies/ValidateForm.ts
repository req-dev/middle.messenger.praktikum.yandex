import Input from '../components/Input';

interface IValidateFormResult{
  valid: boolean,
  errors: IValidateError[],
  data: FormData
}

interface IValidateError{
  inputName: string,
  message: string,
}

class ValidateForm {
  private form: HTMLFormElement;
  private inputs: Input[];

  constructor(form: HTMLFormElement, inputs: Input[]) {
    this.form = form;
    this.inputs = inputs;
  }

  check = (): IValidateFormResult => {
    const inputs: Record<string, HTMLInputElement> = {};
    const errors: IValidateError[] = [];

    this.form.querySelectorAll('input').forEach((el) => {
      const name = el.getAttribute('name');
      inputs[name] = el as HTMLInputElement;
    });

    Object.entries(inputs).forEach(([inputName, input]) => {
      switch (inputName){
        case 'first_name':
        case 'second_name':
          const nameRegex = /^[А-ЯA-ZЁ][а-яa-zё\-]*$/;
          if (!nameRegex.test(input.value)){
            errors.push({
              inputName,
              message: 'латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).'
            });
          }
          break;
        case 'login':
          const loginRegex = /^(?=.*[A-Za-z])[A-Za-z0-9-_]{3,20}$/;
          if (!loginRegex.test(input.value)){
            errors.push({
              inputName,
              message: 'от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).'
            });
          }
          break;
        case 'email':
          const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
          if (!emailRegex.test(input.value)){
            errors.push({
              inputName,
              message: ' латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.'
            });
          }
          break;
        case 'password':
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,40}$/;
          if (!passwordRegex.test(input.value)){
            errors.push({
              inputName,
              message: 'от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.'
            });
          }
          break;
        case 'phone':
          const phoneRegex = /^\+?\d{10,15}$/;
          if (!phoneRegex.test(input.value)){
            errors.push({
              inputName,
              message: 'от 10 до 15 символов, состоит из цифр, может начинается с плюса.'
            });
          }
          break;
        case 'message':
          if (input.value.trim() === ''){
            errors.push({
              inputName,
              message: 'Message cannot be empty'
            });
          }
          break;
        case 'password_repeat':
          break;
        default:
          console.warn(`Unknown input ${inputName}, validation was skipped.`);
      }
    });

    // check if passwords match in the sign-up form
    const password = inputs['password'];
    const passwordRepeat = inputs['password_repeat'];
    if (password && passwordRepeat){
      if (password.value !== passwordRepeat.value){
        errors.push({
          inputName: passwordRepeat.getAttribute('name'),
          message: 'Passwords do not match'
        });
      }
    }

    // check the change password form
    const newPassword = inputs['newPassword'];
    const repeatNewPassword = inputs['repeatNewPassword'];
    if (newPassword && repeatNewPassword){
      if (newPassword.value !== repeatNewPassword.value){
        errors.push({
          inputName: repeatNewPassword.getAttribute('name'),
          message: 'Passwords do not match'
        });
      }
    }

    this.showErrorsInForm(errors);

    return {
      valid: errors.length === 0,
      errors,
      data: new FormData(this.form)
    };
  }

  private showErrorsInForm = (errors: IValidateError[]) => {
    this.inputs.forEach(input => {

      if (input.targetElement.tagName === 'INPUT'){
        input.setProps({
          errorText: '',
        });
      }

    });
    errors.forEach(error => {
      const targetInput = this.inputs.find((input) => input.props.name === error.inputName);

      if (targetInput) {
        targetInput.setProps({
          errorText: error.message,
        });
      }
    });
  }
}

export { ValidateForm, IValidateError, IValidateFormResult };
