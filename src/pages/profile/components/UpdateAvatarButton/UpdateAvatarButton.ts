import './UpdateAvatarButton.pcss';
import Block, { blockProps } from '../../../../framework/Block';
import connect from '../../../../framework/connectStore';
import { IAppState } from '../../../../framework/Store';

interface UpdateAvatarButtonProps extends blockProps {
  avatar?: string;
}

class UpdateAvatarButton extends Block<UpdateAvatarButtonProps> {
  constructor(props?: UpdateAvatarButtonProps) {
    super({
      ...props,
      staticUrl: 'https://ya-praktikum.tech/api/v2/'
    });
  }

  componentDidMount() {
    this.updatePicture();
  }

  componentDidUpdate(): boolean {
    this.updatePicture();
    return false;
  }

  private updatePicture() {
    const element = this.getContent().querySelector('.profile-page__body-avatar') as HTMLElement;
    element.setAttribute('style', `background-image: url('https://ya-praktikum.tech/api/v2/resources${this.props.avatar}');`);
  }

  render() {
    return `<div class="profile-page__body-avatar">
                <div class="profile-page__body-avatar-hint">
                    <div class="profile-page__body-avatar-hint-text">Change Avatar</div>
                </div>
            </div>`;
  }
}

const mapStateToProps = (state: IAppState) => state.profilePage.userData;

export default connect(mapStateToProps)(UpdateAvatarButton);
