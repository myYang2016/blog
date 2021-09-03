import React from 'react';
import { childPropsType, CompositePropsType } from '../interface/common';

export class Compositor {
  static _instance: Compositor;
  protected constructor() { }
  static instance() {
    if (!Compositor._instance) {
      Compositor._instance = new Compositor();
    }
    return Compositor._instance;
  }
  compose(props: CompositePropsType): Map<childPropsType, React.CSSProperties> {
    const result = new Map();
    const setStyle = (v: childPropsType, options: React.CSSProperties = {}) => {
      const { width, height } = v;
      result.set(v, {
        color: 'red',
        fontSize: '100',
        width: width || 'auto',
        height: height || 'auto',
        ...options,
      });
    };
    setStyle(props, {
      display: 'flex',
    });
    for (let v of props.childrens) {
      setStyle(v);
    }
    return result;
  }
}

export function createCompositor(type: string) {
  console.log(type);
  return Compositor.instance();
}
