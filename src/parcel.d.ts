declare module 'bundle-text:*' {
    const value: string;
    export default value;
}

// This is just to remove warnings/errors for glob-resolution of PNGs resources.
declare module '*.png' {
  const value: string;
  export default value;
}