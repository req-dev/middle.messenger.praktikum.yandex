import store from '../framework/Store';

interface IValidateFormResult{
  isCorrect: boolean,
  errors: Record<string, string>
  data: Record<string, string>
}

class ValidateFormController {
  private dataCascade: string[] = [];
  private inputsErrors: Record<string, string> = {};
  private errorsCount: number = 0;
  private pathToState: string;

  constructor(pathToState = '') {
    this.pathToState = pathToState;
    this.inputsErrors = {};
    this.dataCascade = [];
    this._clearErrors();
  }

  private _clearErrors() {
    this.inputsErrors = {};
    this.dataCascade.forEach((name) => {
      this.inputsErrors[name] = '';
    });
    this.errorsCount = 0;
  }

  private _addError(name: string, message: string) {
    if (!this.inputsErrors[name]){
      this.inputsErrors[name] = message;
      this.errorsCount += 1;
    }
  }

  public clearErrors() {
    this._clearErrors();
    this.applyErrorMessages();
  }

  public validate = (data: Record<string, string>): IValidateFormResult => {
    this.dataCascade = Object.keys(data);
    this._clearErrors();

    const nameRegex = /^[А-ЯA-ZЁ][а-яa-zё-]*$/;
    const loginRegex = /^(?=.*[A-Za-z])[A-Za-z0-9-_]{3,20}$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,40}$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    for (const [inputName, inputValue] of Object.entries(data)) {
      switch (inputName){
        case 'first_name':
        case 'second_name':
          if (!nameRegex.test(inputValue)){
            this._addError(inputName, 'Latin or Cyrillic, the first letter must be capitalized, no spaces and no numbers, no special characters (only a hyphen is acceptable).');
          }
          break;
        case 'login':
          if (!loginRegex.test(inputValue)){
            this._addError(inputName, 'From 3 to 20 characters, Latin, may contain numbers, but not consist of them, no spaces, no special characters (hyphens and underscores are acceptable).');
          }
          break;
        case 'email':
          if (!emailRegex.test(inputValue)){
            this._addError(inputName, 'Latin, can include numbers and special characters like hyphens and underscores, there must be a “at” (@) and a dot after it, but there must be letters before the dot.');
          }
          break;
        case 'password':
        case 'newPassword':
          if (!passwordRegex.test(inputValue)){
            this._addError(inputName, 'From 8 to 40 characters, at least one capital letter and number are required.');
          }
          break;
        case 'phone':
          if (!phoneRegex.test(inputValue)){
            this._addError(inputName, 'From 10 to 15 characters, consists of numbers, may begin with a plus.');
          }
          break;
        case 'message':
          if (inputValue.trim() === ''){
            this._addError(inputName, 'Message cannot be empty');
          }
          break;
        case 'display_name':
          if (inputValue.trim() === ''){
            this._addError(inputName, 'Nickname cannot be empty');
          }
          break;
        case 'avatar':
          if (inputValue === ''){
            this._addError(inputName, 'File is not attached');
          }
          break;
        case 'title':
          if (inputValue.trim() === ''){
            this._addError(inputName, 'Title cannot be empty');
          }
          break;
      }
    }

    // check if passwords match in the sign-up form
    const password = data['password'];
    const passwordRepeat = data['password_repeat'];
    if (password && passwordRepeat !== undefined){
      if (password !== passwordRepeat){
        this._addError('password_repeat', 'Passwords do not match');
      }
    }

    // check the change password form
    const oldPassword = data['oldPassword'];
    const newPassword = data['newPassword'];
    const repeatNewPassword = data['repeatNewPassword'];
    if (newPassword && repeatNewPassword !== undefined){

      if (oldPassword === ''){
        this._addError('oldPassword', 'Old password cannot be empty');
      }

      if (newPassword !== repeatNewPassword){
        this._addError('repeatNewPassword', 'Passwords do not match');
      }

    }

    this.applyErrorMessages();

    return {
      isCorrect: this.errorsCount === 0,
      errors: this.inputsErrors,
      data
    };
  }

  private applyErrorMessages = () => {
    store.set(`${this.pathToState}.formErrors`, this.inputsErrors);
  }
}

export { ValidateFormController, IValidateFormResult };
