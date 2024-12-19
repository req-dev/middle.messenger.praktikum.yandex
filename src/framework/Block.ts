import Handlebars from 'handlebars';
import { EventBus } from './EventBus';

export interface props extends Record<string, unknown>{
  className?: string,
  child?: string,
  events?: Record<string, (...args) => void>,
  attr?: Record<string, string>,
  settings?: {
    withInternalID?: boolean
  }
  __id?: number
}

abstract class Block<T extends props> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  private _element: HTMLElement;

  private _meta = null;

  private _id = Math.ceil(Math.random()*1420503132 + Math.random()*120462132);

  public props: T;

  public eventBus: () => EventBus;

  private children: Record<string, Block<T>>;

  protected constructor(tagName = 'div', propsAndChildren: T) {
    let { children, props } = this._getChildren(propsAndChildren);
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
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  private _getChildren(propsAndChildren: T) {
    const children: Record<string, Block<T>> = {};
    const props: props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value as Block<T>;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  private _init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _addEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this._element.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this._element.removeEventListener(eventName, events[eventName]);
    });
  }

  private _componentDidMount() {
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  componentDidMount(oldProps?: props) {
    return true;
  }

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate() {
    const needRerender = this.componentDidUpdate();
    if (needRerender) {
      this._render();
    }
  }

  componentDidUpdate(): boolean {
    return true;
  }

  addAttributes() {
    const { attr } = this.props;
    if (!attr) return;

    Object.entries(attr).forEach(([key, value]) => {
      this._element.setAttribute(key, value);
    });
  }

  setProps = (nextProps) => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  private _render() {
    const propsAndStubs = { ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;

    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      stub.replaceWith(child.getContent());
    });

    const block = fragment.content;
    this._removeEvents();
    this._element.innerHTML = ''; // deleting the previous HTML
    this._element.appendChild(block);
    this._addEvents();
    this.addAttributes();
  }

  abstract render(): string

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: T) {
    const context = this;
    return new Proxy(props, {
      set(target, key, value) {
        target[key] = value;
        context.eventBus().emit(Block.EVENTS.FLOW_CDU);
        return true;
      },
    });
  }

  private _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    if (this.props.settings?.withInternalID) {
      element.setAttribute('data-id', this._id);
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
