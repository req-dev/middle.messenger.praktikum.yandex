// language=hbs
import Block, { blockProps } from '../../../../framework/Block';

export default class BackButton extends Block{
  constructor(props?: blockProps) {
    super('button', {
      ...props,
      className: 'profile-page__back-btn'
    });
  }
  render() {
    return `<div class="profile-page__back-btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="profile-page__back-btn-icon-svg" viewBox="0 -960 960 960"
                 fill="#FFFFFF">
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
            </svg>
        </div>`;
  }
}
