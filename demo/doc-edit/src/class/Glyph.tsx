import React from 'react';
import { Command, BorderCommand } from './Command';

export interface GlyphPropsType {
  type?: string,
  style?: React.CSSProperties,
  width?: string,
  height?: string,
}

export default abstract class Glyph<P extends GlyphPropsType> extends React.Component<P> {
  id: string = 'Glyph';
  childrens: Glyph<GlyphPropsType>[] = [];
  command: Command;
  constructor(props: Readonly<P> | P) {
    super(props);
    this.command = new BorderCommand();
    this.handClick = this.handClick.bind(this);
  }
  handClick(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const el = ev.target as HTMLInputElement;
    this.command.Execute(el);
  }
  getRender(): JSX.Element | string {
    return <div></div>
  }
  render() {
    return <div onClick={(e) => this.handClick(e)} id={this.id} key={this.id} style={Object.assign({}, this.props.style || {}, { width: this.props.width || 'auto', height: this.props.height || 'auto' })}>
      {this.getRender()}
    </div>
  }
}
