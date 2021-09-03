import './style/common.scss';
import React from 'react';
import logo from './logo.svg';
import './App.css';
import testImg from './images/test.jpeg';
import GlyphComposite from './class/GlyphComposite';
import { childPropsType } from './interface/common';
import Menu from './class/Menu';

class App<P = {}> extends React.Component<P, { childrens: childPropsType[], [key: string]: any }> {
  constructor(props: P) {
    super(props);
    this.state = {
      childrens: [
        {
          type: 'Text',
          text: 'yang....',
        },
        {
          type: 'Picture',
          src: testImg,
          alt: '测试图片',
          width: '100px',
        },
        {
          type: 'GlyphComposite',
          width: '200px',
          height: 'auto',
          childrens: [
            {
              type: 'Text',
              text: 'hahah....',
            },
            {
              type: 'Picture',
              src: testImg,
              alt: '测试图片',
              width: '100px',
            },
          ]
        }
      ]
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <GlyphComposite childrens={this.state.childrens}>
            <Menu></Menu>
          </GlyphComposite>
        </header>
      </div>
    );
  }
}

export default App;
