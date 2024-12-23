import Handlebars from 'handlebars';
import { EventBus } from './EventBus';
import getRandomNumber from '../unitilies/getRandomNumber';

export interface blockProps extends Record<string, unknown>{
  childrenList?: Record<string, Block[]>,
  events?: Record<string, (...args: unknown[]) => void>,
  className?: string,
  attr?: { class?: string, listid?: string, belongsToList?: string } & Record<string, string>,
  settings?: {
    withInternalID?: boolean,
    targetElementForEvents?: string
  }
  __id?: number
}

abstract class Block<T extends blockProps = blockProps> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_CWU: 'flow:component-will-unmount',
    FLOW_RENDER: 'flow:render',
  };

  private _element: HTMLElement;
  private readonly _meta: { tagName: string, props: blockProps };
  private _id = getRandomNumber();
  public props: T;
  public eventBus: () => EventBus;
  protected children: Record<string, Block<T>> = {};

  protected constructor(tagName = 'div', propsAndChildren: T) {
    const getChildren = this._getChildren(propsAndChildren);
    const { children } = getChildren;
    let { props } = getChildren;
    const eventBus = new EventBus();
    this.children = children;

    props = { ...props, __id: this._id };
    this._meta = {
      tagName,
      props,
    };
    this.props = this._makePropsProxy({ ...props });

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CWU, this._componentWillUnmount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  private _getChildren(propsAndChildren: T) {
    const children: Record<string, Block<T>> = {};
    const props: blockProps = {};

    // childrenList is an array of blocks with any length
    // They must be named differently {sectionName}__{randomId}
    // They will be inserted into HTML to {sectionName} area
    if (propsAndChildren.childrenList) {
      for (const [key, blocks] of Object.entries(propsAndChildren.childrenList)) {
        for (const child of blocks) {
          const id = `${key}__${getRandomNumber()}`;
          children[id] = child as Block<T>;
        }
      }
    }

    // looking for regular blocks
    for (const [key, value] of Object.entries(propsAndChildren)) {
      if (value instanceof Block) {
        children[key] = value as Block<T>;
      } else {
        props[key] = value;
      }
    }

    return { children, props };
  }

  private _init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _addEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this.targetElement?.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this.targetElement?.removeEventListener(eventName, events[eventName]);
    });
  }

  private _componentDidMount() {
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  // user can override it
  componentDidMount(): void { }

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentWillUnmount() {
    this._removeEvents();
    this.componentWillUnmount();
  }

  // user can override it
  componentWillUnmount(): void { }

  private _componentDidUpdate(oldProps: T) {
    const needRerender = this.componentDidUpdate(oldProps);
    if (needRerender) {
      this.eventBus().emit(Block.EVENTS.FLOW_CWU);
      this._render();
    }
  }

  // user can override it
  // if it returns true, block will rerender
  // I disabled this rule so auto-complete can work and user will see the reference with args
  componentDidUpdate(oldProps: T): boolean { return true; }

  protected addAttributes() {
    const attr = this.props.attr || {};

    if (this.props.className && !attr.class?.includes(this.props.className)){
      // merging both className and attr.class if defined
      if (!attr.class){
        attr.class = this.props.className;
      }else {
        attr.class += ` ${this.props.className}`;
      }
    }

    Object.entries(attr).forEach(([key, value]) => {
      this._element.setAttribute(key, value);
    });
  }

  protected removeAttributes() {
    while (this._element.attributes.length > 0) {
      this._element.removeAttribute(this._element.attributes[0].name);
    }
  }

  setProps = (nextProps: blockProps) => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  get element(): HTMLElement {
    return this._element;
  }

  get targetElement(): HTMLElement {
    const { settings } = this.props
    return settings?.targetElementForEvents ?
      this._element.querySelector(settings.targetElementForEvents)! as HTMLElement : this._element;
  }

  private _render() {
    const additionalBlocks: Record<string, Block<T>[]> = {}; // blocks from childrenList array will be here
    const propsAndStubs = { ...this.props }; // rest of the props

    for (const [key, child] of Object.entries(this.children)) {
      const [prefix] = key.split('__');
      // blocks from childrenList have key separated with __
      // it's the way to divide them from regular children
      if (key.includes('__')) {
        if (!additionalBlocks[prefix]) {
          additionalBlocks[prefix] = [];
        }
        additionalBlocks[prefix].push(child);
      }
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    }

    // prepare blocks from childrenList to be inserted to HTML differently
    const additionalHtml: Record<string, string> = {};
    for (const [key, blocks] of Object.entries(additionalBlocks)) {
      additionalHtml[key] = blocks
        .map(block => `<div data-id="${block._id}"></div>`)
        .join('');
    }

    // render template with additional blocks from childrenList
    const template = this._createDocumentElement('template') as HTMLTemplateElement;
    template.innerHTML = Handlebars.compile(this.render())({
      ...propsAndStubs,
      ...additionalHtml,
    });

    for (const child of Object.values(this.children)) {
      const placeholder = template.content.querySelector(`[data-id="${child._id}"]`);
      placeholder?.replaceWith(child.getContent());
    }

    this._removeEvents();
    this._element.innerHTML = ''; // Clear previous HTML
    this._element.appendChild(template.content);
    this._addEvents();
    this.removeAttributes();
    this.addAttributes();
  }

  // user have to override it
  abstract render(): string

  getContent() {
    return this.element;
  }

  private _makePropsProxy(props: T) {
    return new Proxy(props, {
      set: (target, key, value) => {
        const oldProps = { ...target };
        target[key] = value;
        this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps);
        return true;
      },
    });
  }

  private _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    if (this.props.settings?.withInternalID) {
      element.setAttribute('data-id', this._id.toString());
    }
    return element;
  }

  show() {
    this.getContent().style.display = 'block';
  }

  hide() {
    this.getContent().style.display = 'none';
  }
}

export default Block;
