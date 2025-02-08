import Block, { blockProps } from './Block';
import store, { IAppState } from './Store';
import isEqual from '../unitilies/isEqual';

function connect<P extends blockProps = blockProps>(mapStateToProps: (state: IAppState) => unknown) {
  return function(Component: typeof Block<P>) {
    return class extends Component {
      constructor(...args: P[]) {
        const props = args[0] as unknown as P;
        let state = mapStateToProps(store.getState()) ?? {};

        super({...props, ...state} as P);

        store.subscribe('', () => {
          const newState = mapStateToProps(store.getState()) ?? {};

          if (!isEqual(state, newState)) {
            this.setProps({...newState} as P);
          }
          state = newState;
        });
      }
    }
  }
}

export default connect;
