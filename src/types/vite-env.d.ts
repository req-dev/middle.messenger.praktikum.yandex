// types.d.ts

// PostCSS
declare module '*.pcss' {
    const content: string;
    export default content;
}

// Handlebars (?raw)
declare module '*.hbs?raw' {
    const template: string;
    export default template;
}
