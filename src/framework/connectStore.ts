import Block, { blockProps } from './Block';
import store, { IAppState } from './Store';
import isEqual from '../unitilies/isEqual';

function connect<P extends blockProps = blockProps>(mapStateToProps: (state: IAppState) => Partial<P> | undefined) {
  return function<T extends new (props?: P) => Block<P>>(Component: T) {
    return class extends Component {
      constructor(props?: Partial<P>) {
        let state = mapStateToProps(store.getState()) ?? {};

        super({...props, ...state} as P);

        // rewrite to subscribe
        store.onUpdate(() => {
          const newState = mapStateToProps(store.getState()) ?? {};

          if (!isEqual(state, newState)) {
            this.setProps({...newState} as P);
          }
          state = newState;
        });
      }
    } as T
  }
}

export default connect;
