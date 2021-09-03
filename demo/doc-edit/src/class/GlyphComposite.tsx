import React from 'react';
import { createCompositor, Compositor } from './Compositor';
import Glyph, { GlyphPropsType } from './Glyph';
import { childPropsType } from '../interface/common';
import Text, { TextProps } from './Text';
import Picture, { PictureProps } from './Picture';

export interface GlyphCompositeProps extends GlyphPropsType {
  childrens: childPropsType[],
  compositorType?: string,
}

let id = 0;
export default class GlyphComposite extends Glyph<GlyphCompositeProps> {
  childMap: Map<childPropsType, Glyph<GlyphPropsType>> = new Map();
  compositor: Compositor;
  constructor(props: GlyphCompositeProps) {
    super(props);
    this.id = `GlyphComposite_${id++}`;
    this.compositor = createCompositor(props.compositorType || 'default');
  }
  getRender() {
    const { clientWidth: dw, clientHeight: dh } = document.documentElement;
    const styleMap = this.compositor.compose(this.props);
    return <div style={styleMap.get(this.props)}>
      {this.props.children}
      {this.props.childrens.map((data) => {
        const style = styleMap.get(data) || {};
        switch (data.type) {
          case 'Text': {
            return <Text
              text={(data as TextProps).text}
              key={this.id + 0}
              ref={node => {
                if (node) {
                  this.childMap.set(data, node);
                }
              }}
              style={style}
            ></Text>
          }
          case 'Picture': {
            const { src, alt, width, height } = data as PictureProps;
            return <Picture
              src={src}
              alt={alt}
              width={width}
              height={height}
              key={this.id + 1}
              ref={node => {
                if (node) {
                  this.childMap.set(data, node);
                }
              }}
              style={style}
            ></Picture>
          }
          case 'GlyphComposite': {
            const { width = `${dw}`, height = `${dh}`, childrens } = data as GlyphCompositeProps;
            return <GlyphComposite
              childrens={childrens}
              key={this.id + 2}
              width={width}
              height={height}
              ref={node => {
                if (node) {
                  this.childMap.set(data, node);
                }
              }}
              style={style}
            ></GlyphComposite>
          }
          default:
            return <div></div>
        };
      })}
    </div>
  }
}
