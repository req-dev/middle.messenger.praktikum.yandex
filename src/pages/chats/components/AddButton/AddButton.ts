import './AddButton.pcss';
import Button, { ButtonProps } from '../../../../components/Button';

interface AddButtonProps extends ButtonProps {
  text?: string;
}

export default class AddButton extends Button<AddButtonProps> {
  constructor(AddButtonProps?: AddButtonProps) {
    super({
      ...AddButtonProps,
      text: '',
      className: 'add-button'
    });
  }

  render() {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`;
  }
}
