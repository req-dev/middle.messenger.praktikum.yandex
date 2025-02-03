import ErrorPage from './Error';

class Error404 extends ErrorPage {
  constructor() {
    super({
      code: '404',
      codeDesc: 'Not Found',
      message: 'It seems like you lost',
    });
  }
}

export default Error404;
