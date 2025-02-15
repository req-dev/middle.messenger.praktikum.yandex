import Block, { blockProps } from '../Block';

class Component extends Block {
  constructor(props?: blockProps) {
    super({
      ...props,
      text: 'default',
      test: 'value',
    });
  }

  componentDidMount() { }

  render() {
    return `<div>{{text}}</div>`;
  }

}

describe('Block', () => {
  let component: Component;

  beforeEach(() => {
    component = new Component();
  });

  it('should rerender after changing props', () => {
    const renderMethod = jest.spyOn(component, 'render');

    component.setProps({ text: 'Hello' });

    expect(renderMethod).toBeCalled();
  });

  it('should insert passed prop to the HTML after changing it', () => {
    component.setProps({ text: 'Hello' });
    const changedHTML = component.getContent().innerHTML;

    expect(changedHTML).toStrictEqual('<div>Hello</div>');
  });

  it('should not rerender after props the same', () => {
    const renderMethod = jest.spyOn(component, 'render');

    // values are exactly the same as initial ones
    component.setProps({ text: 'default' });
    component.setProps({ test: 'value' });

    expect(renderMethod).not.toHaveBeenCalled();
  });

  it('should call dispatchComponentDidMount on child when dispatchComponentDidMount is called on the parent block', () => {
    const childComponent = new Component();
    const parent = new Component({ childComponent });
    const childComponentDidMount = jest.spyOn(childComponent, 'componentDidMount');

    parent.dispatchComponentDidMount();

    expect(childComponentDidMount).toBeCalled();
  });

});
