import React from 'react';
import Glyph, { GlyphPropsType } from './Glyph';

export interface PictureProps extends GlyphPropsType {
  src: string,
  alt: string,
}

let id = 0;
export default class Picture extends Glyph<PictureProps> {
  constructor(props: PictureProps) {
    super(props);
    this.id = `Glyph_picture_${id++}`;
  }
  getRender() {
    return (
      <img
        src={this.props.src}
        alt={this.props.alt}
        style={{ width: '100%' }}
      ></img>
    )
  }
}