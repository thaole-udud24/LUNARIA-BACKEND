declare module '*.less';
declare namespace API {
  type User = {
    id: number;
    name: string;
    role?: string;
  };
};

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}