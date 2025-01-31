import './ChatOptionsButton.pcss';
import Button from '../../../../../../components/Button';
import { blockProps } from '../../../../../../framework/Block';

export default class ChatOptionsButton extends Button {
  constructor(props?: blockProps) {
    super({
      ...props,
      text: '',
      className: 'chats-page__dialog-area-header-submenu-btn'
    });
  }

  render() {
    return `{{#if loading}}
              {{{loadingSpinner}}}
          {{else}}
              <svg xmlns="http://www.w3.org/2000/svg" class="chats-page__dialog-area-header-submenu-btn-icon" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
          {{/if}}`
  }
}
