import { Indexed } from '../unitilies/merge';
import Block, { blockProps } from './Block';
import store, { IAppState } from './Store';
import isEqual from '../unitilies/isEqual';

function connect<TProps extends blockProps>(mapStateToProps: (state: IAppState) => Indexed | undefined) {
  return function(Component: typeof Block) {
    return class extends Component {
      constructor(props: TProps) {
        let state = mapStateToProps(store.getState()) ?? {};

        super({...props, ...state});

        // rewrite to subscribe
        store.onUpdate(() => {
          const newState = mapStateToProps(store.getState()) ?? {};

          if (!isEqual(state, newState)) {
            this.setProps({...newState});
          }
          state = newState;
        });
      }
    }
  }
}

export default connect;
