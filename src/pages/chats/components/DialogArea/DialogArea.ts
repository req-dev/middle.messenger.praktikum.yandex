import Block, { blockProps } from '../../../../framework/Block';
import store, { IAppState } from '../../../../framework/Store';
import connect from '../../../../framework/connectStore';
import { MessageModel } from '../../../../types/data';
import DialogMessage from './Components';
import isEqual from '../../../../unitilies/isEqual';
import formatDate from '../../../../unitilies/formatDate';

interface DialogAreaProps extends blockProps {
  messages?: MessageModel[],
  childrenList?: { messagesComponents?: DialogMessage[] } & Record<string, Block[]>
}

class DialogArea extends Block<DialogAreaProps> {
  constructor(props?: DialogAreaProps) {
    super({
      ...props,
      className: 'chats-page__dialog-area-msgs',
      childrenList: {
        messagesComponents: []
      }
    });
  }

  componentDidUpdate(oldProps: DialogAreaProps): boolean {
    const messagesData = this.props.messages ?? [];
    const messagesDataChanged = !isEqual(oldProps.messages ?? [], messagesData);
    const myUserId = store.getState().user?.id;

    if (messagesDataChanged) {
      // updates components from the received list
      const messagesComponents: DialogMessage[] = [];
      for (const messageData of messagesData) {
        messagesComponents.push(new DialogMessage({
          text: messageData.content,
          date: formatDate(messageData.time, 'HH:mm'),
          fromMe: Number(messageData.user_id) == myUserId!,
        }));
      }

      this.setProps({ childrenList: { messagesComponents } });
    }
    return super.componentDidUpdate(oldProps);
  }

  render() {
    return `{{{messagesComponents}}}`;
  }
}
const mapStateToProps = (state: IAppState) => state.chatsPage.dialogArea;

export default connect<DialogAreaProps>(mapStateToProps)(DialogArea);
