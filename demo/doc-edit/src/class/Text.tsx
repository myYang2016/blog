import Glyph, { GlyphPropsType } from './Glyph';

export interface TextProps extends GlyphPropsType {
  text: string,
}

let id = 0;
export default class Text extends Glyph<TextProps> {
  constructor(props: TextProps) {
    super(props);
    this.id = `Glyph_text_${id++}`;
  }
  getRender() {
    return this.props.text;
  }
}
