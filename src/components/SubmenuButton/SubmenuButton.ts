import './SubmenuButton.pcss';
import Button, { ButtonProps } from '../Button';

interface SubmenuButtonProps extends ButtonProps {
  icon?: string,
  text?: string
}

export default class SubmenuButton extends Button<SubmenuButtonProps> {
  constructor(props?: SubmenuButtonProps) {
    super({
      ...props,
      className: 'submenu-button',
    });
  }

  render() {
    return `{{#if loading}}
              {{{loadingSpinner}}}
          {{else}}
              <img src="{{icon}}" class="submenu-button-icon" alt="icon" />
              <div class="submenu-button-text">{{text}}</div>
          {{/if}}`;
  }
}
