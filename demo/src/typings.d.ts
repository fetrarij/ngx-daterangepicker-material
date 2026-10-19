/* eslint-disable no-var */
/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// Example templates imported as text with { loader: 'text' }, to show their code.
declare module '*.html' {
  const content: string;
  export default content;
}
