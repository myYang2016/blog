export abstract class Command {
  Execute(el: HTMLInputElement) { }
}

export class BorderCommand extends Command {
  hasBorder: boolean = false;
  Execute(el: HTMLInputElement) {
    console.log(this.hasBorder);
    el.setAttribute('class', 'glyph');
  }
}
