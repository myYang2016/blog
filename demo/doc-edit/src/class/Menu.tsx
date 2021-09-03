import React from 'react';
import Glyph, { GlyphPropsType } from './Glyph';

let id = 0;
export default class Menu extends Glyph<GlyphPropsType> {
  constructor(props: GlyphPropsType) {
    super(props);
    this.id = `Glyph_menu_${id++}`;
  }
  getRender() {
    return (
      <select>
        <option>红色</option>
        <option selected={true}>黄色</option>
        <option>黑色</option>
      </select>
    )
  }
}