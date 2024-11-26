import ActionsEnum from '@common/common/enums/ActionEnum';

export class MessageResponseAffico {
  static getMessageAction(action: ActionsEnum): string {
    let message = '';
    switch (action) {
      case ActionsEnum.CREATE:
        message = 'created ';
        break;
      case ActionsEnum.DELETE:
        message = 'deleted ';
        break;
      case ActionsEnum.LOGIN:
        message = 'login ';
        break;
      case ActionsEnum.LOGOUT:
        message = 'logout ';
        break;
      case ActionsEnum.SEARCH:
        message = 'finded ';
        break;
      case ActionsEnum.UPDATE:
        message = 'updated ';
        break;
    }
    return message;
  }

  static getMessageCode(code: number, action?: ActionsEnum): string {
    action = action ?? ActionsEnum.NOACTION;
    let message = 'no message';
    switch (code) {
      case 201:
      case 200:
        message =
          'was ' +
          MessageResponseAffico.getMessageAction(action) +
          'successfully';
        break;
      case 400:
        message = 'Bad Request';
        break;
      case 401:
        message =
          'unauthorized: Access is denied due to invalid credentials to ' +
          action.toLowerCase();
        break;
      case 402:
        message = 'payment Required to ' + action.toLowerCase();
        break;
      case 403:
        message =
          'you do not have permission to access the ' + action.toLowerCase();
        break;
      case 404:
        message =
          'you did not break the internet, but we cannot found what you are looking for';
        break;
      case 500:
        message =
          'well, this is unexpected. An errror has occurred and we are working to fix the problem! as soon possible';
        break;
      case 501:
        message =
          'not Implemented. The request cannot be carried out by the web server';
        break;
    }
    return message;
  }
}
