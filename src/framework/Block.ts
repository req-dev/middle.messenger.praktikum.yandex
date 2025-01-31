import Handlebars from 'handlebars';
import { EventBus } from './EventBus';
import getRandomNumber from '../unitilies/getRandomNumber';
import isEqual from '../unitilies/isEqual';

enum BlockEvents {
  INIT = 'init',
  FLOW_CDM = 'flow:component-did-mount',
  FLOW_CDU = 'flow:component-did-update',
  FLOW_CWD = 'flow:component-will-destroy',
  FLOW_CWU = 'flow:component-will-unmount',
  FLOW_RENDER = 'flow:render',
}

export interface blockProps extends Record<string, unknown>{
  childrenList?: Record<string, Block[]>,
  events?: Record<string, (...args: unknown[]) => void>,
  className?: string,
  attr?: { class?: string, listid?: string, belongsToList?: string } & Record<string, string>,
  settings?: {
    withInternalID?: boolean,
    targetElementForEvents?: string,
    excludedAttributes?: string[], // list of attributes that will not be affected while rerender
  }
  __id?: number
}

abstract class Block<T extends blockProps = blockProps> {

  private _element: HTMLElement;
  private readonly _meta: { tagName: string, props: blockProps };
  private _visible: boolean;
  private _id = getRandomNumber();
  public props: T;
  public eventBus: () => EventBus;
  protected children: Record<string, Block<T>> = {};
  protected nestedChildren: Record<string, Block<T>> = {};

  protected constructor(propsAndChildren?: T, tagName: string = 'div') {
    const getChildren = this._getChildren(propsAndChildren ?? {} as unknown as T);
    const { children, nestedChildren } = getChildren;
    let { props } = getChildren;
    const eventBus = new EventBus();
    this.children = children;
    this.nestedChildren = nestedChildren;

    props = { ...props, __id: this._id };
    this._visible = true;
    this._meta = {
      tagName,
      props,
    };
    this.props = this._makePropsProxy({ ...props });

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(BlockEvents.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(BlockEvents.INIT, this._init.bind(this));
    eventBus.on(BlockEvents.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(BlockEvents.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(BlockEvents.FLOW_CWD, this._componentWillDestroy.bind(this));
    eventBus.on(BlockEvents.FLOW_CWU, this._componentWillUnmount.bind(this));
    eventBus.on(BlockEvents.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  private _getChildren(propsAndChildren: T) {
    const children: Record<string, Block<T>> = {};
    const nestedChildren: Record<string, Block<T>> = {};
    const props: blockProps = {};

    // nestedChildren is an array of blocks with any length
    // They will be named differently {childrenName}__{randomId}
    // This list be inserted into HTML to {{{childrenName}}} area
    if (propsAndChildren.childrenList) {
      for (const [key, blocks] of Object.entries(propsAndChildren.childrenList)) {
        for (const child of blocks) {
          const id = `${key}__${getRandomNumber()}`;
          nestedChildren[id] = child as Block<T>;
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

    return { children, props, nestedChildren };
  }

  private _init() {
    this._createResources();
    // first render will be performed without adding events
    // they will be added only after inserting a component into DOM (componentDidMount)
    this.eventBus().emit(BlockEvents.FLOW_RENDER, true);
  }

  private _addEvents() {
    const events = this.props.events ?? {};

    for (const [event, func] of Object.entries(events)) {
      this.targetElement.addEventListener(event, func);
    }
  }

  private _removeEvents() {
    const events = this.props.events ?? {};

    for (const [event, func] of Object.entries(events)) {
      this.targetElement?.removeEventListener(event, func);
    }
  }

  private _componentDidMount() {
    this.addAttributes();
    this._addEvents();
    this._applyVisible();
    this.componentDidMount();

    for (const child of Object.values({ ...this.children, ...this.nestedChildren })) {
      child.dispatchComponentDidMount();
    }
  }

  // user can override it
  componentDidMount(): void { }

  dispatchComponentDidMount() {
    this.eventBus().emit(BlockEvents.FLOW_CDM);
  }

  private _componentWillDestroy() {
    this._componentWillUnmount();
    this._element.remove();
  }

  // prepares component to be completely unmounted
  dispatchComponentDestroy() {
    this.eventBus().emit(BlockEvents.FLOW_CWD);
  }

  private _componentWillUnmount() {
    this._removeEvents();
    this.componentWillUnmount();
  }

  // user can override it
  componentWillUnmount(): void { }

  // component will be rendered if 'componentDidUpdate' returns true or nestedChildren is updated
  private _componentDidUpdate(oldProps: T) {
    const needRerender = this.componentDidUpdate(oldProps);
    const nestedChildrenUpdated = !isEqual(oldProps.childrenList ?? {}, this.props.childrenList ?? {});

    if (needRerender || nestedChildrenUpdated) {
      this.eventBus().emit(BlockEvents.FLOW_CWU);

      if (nestedChildrenUpdated) {
        // delete previous nestedChildren
        for (const child of Object.values(this.nestedChildren)) {
          child.dispatchComponentDestroy();
        }

        // replacing nestedChildren with new ones, so they will be processed in _render()
        this.nestedChildren = this._getChildren(this.props).nestedChildren;
      }

      this._render();

      if (nestedChildrenUpdated) {
        // finishing mounting new nestedChildren
        Object.values(this.nestedChildren).forEach((child) => {
          child.dispatchComponentDidMount();
        });
      }

      this.componentAfterUpdate();
    }
  }

  // user can override it
  // if it returns true, block will rerender
  componentDidUpdate(oldProps: T): boolean {
    return !isEqual(oldProps, this.props);
  }

  // user can override it
  componentAfterUpdate(): void { }

  protected addAttributes() {
    const attr = this.props.attr ?? {};

    if (this.props.className && !attr.class?.includes(this.props.className)){
      // merging both className and attr.class if defined
      if (!attr.class){
        attr.class = this.props.className;
      }else {
        attr.class += ` ${this.props.className}`;
      }
    }

    for (const [key, value] of Object.entries(attr)) {
      this._element.setAttribute(key, value);
    }
  }

  protected removeAttributes() {
    const attrs = this._element.attributes;
    const excluded = (this.props.settings?.excludedAttributes ?? []) as string[];

    for (const attr of attrs) {
      if (!excluded.includes(attr.name)) {
        this._element.removeAttribute(attr.name);
      }
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

  private _render(firstRender: boolean = false) {
    const allChildren = { ...this.children, ...this.nestedChildren };
    const nestedBlocks: Record<string, Block<T>[]> = {};
    const propsAndStubs: blockProps = { ...this.props }; // rest of the props + other children's HTML

    // nestedBlocks sorting
    for (const [key, child] of Object.entries(this.nestedChildren)) {
      const [prefix] = key.split('__');
      if (!nestedBlocks[prefix]) {
        nestedBlocks[prefix] = [];
      }
      nestedBlocks[prefix].push(child);
    }

    // prepare other children
    for (const [key, child] of Object.entries(this.children)) {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    }

    // prepare blocks from nestedBlocks to be inserted to HTML differently
    const nestedBlocksHtml: Record<string, string> = {};
    for (const [key, blocks] of Object.entries(nestedBlocks)) {
      nestedBlocksHtml[key] = blocks
        .map(block => `<div data-id="${block._id}"></div>`)
        .join('');
    }

    // render template with all children together
    const template = this._createDocumentElement('template') as HTMLTemplateElement;
    template.innerHTML = Handlebars.compile(this.render())({
      ...propsAndStubs,
      ...nestedBlocksHtml,
    });

    // replacing all the children with their content
    for (const child of Object.values(allChildren)) {
      const placeholder = template.content.querySelector(`[data-id="${child._id}"]`);
      placeholder?.replaceWith(child.getContent());
    }

    this._removeEvents();
    this.removeAttributes();
    this._element.innerHTML = ''; // Clear previous HTML
    this._element.appendChild(template.content);

    if (!firstRender) {
      // all of this will be executed in componentDidMount to prevent loosing events
      this.addAttributes();
      this._addEvents();
      this._applyVisible();
    }
  }

  // user have to override it
  render(): string {
    return ''
  }

  getContent() {
    return this.element;
  }

  private _makePropsProxy(props: blockProps): T {
    return new Proxy(props, {
      set: (target, key, value) => {
        const oldProps = { ...target };
        if (typeof key === 'string') {
          target[key] = value;
        }
        this.eventBus().emit(BlockEvents.FLOW_CDU, oldProps);
        return true;
      },
    }) as T;
  }

  private _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    if (this.props.settings?.withInternalID) {
      element.setAttribute('data-id', this._id.toString());
    }
    return element;
  }

  show() {
    this._visible = true;
    this._applyVisible();
  }

  hide() {
    this._visible = false;
    this._applyVisible();
  }

  private _applyVisible() {
    const element = this.getContent();

    if (this._visible) {
      const style = element.getAttribute('style');

      if (style) {
        const fixedStyle = style
          .replace('display: none;', '')
          .replace('display:none;', '')
          .replace('display: none', '')
          .replace('display:none', '');

        element.setAttribute('style', fixedStyle);
      }
    } else {
      element.style.display = 'none';
    }
  }
}

export default Block;
