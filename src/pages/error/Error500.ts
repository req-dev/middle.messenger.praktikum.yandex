import ErrorPage from './Error';

class Error500 extends ErrorPage {
  constructor() {
    super({
      code: '500',
      codeDesc: 'Internal Server Error',
      message: 'We\'re already working on it',
    });
  }
}

export default Error500;
