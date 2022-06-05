import './App.css';
import { useEffect, useRef, useState } from 'react';


function check_tab(element, event, setText) {
  let code = element.value;
  if(event.key === "Tab") {
    /* Tab key pressed */
    event.preventDefault(); // stop normal
    let before_tab = code.slice(0, element.selectionStart); // text before tab
    let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
    let cursor_pos = element.selectionEnd + 1; // where cursor moves after tab - moving forward by 1 char to after tab
    element.value = before_tab + "\t" + after_tab; // add tab char
    // move cursor
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
    setText(element.value);
    //update(element.value, preRef); // Update text to include indent
  }
}

function App() {
  const preRef = useRef();
  const editRef = useRef();
  const [text, setText] = useState('');
  const [scroll, setScroll] = useState({top: 0, left: 0});

  useEffect( () => { 
    preRef.current.scrollTop = editRef.current.scrollTop;
    preRef.current.scrollLeft = editRef.current.scrollLeft;
    console.log(editRef.current.scrollTop, 'first visible line = ', editRef.current.scrollTop/25  )
  }, [scroll]);

  useEffect( () => {
    const resized = () => {
      preRef.current.style.width = editRef.current.style.width;
      preRef.current.style.height = editRef.current.style.height;
    }
    new MutationObserver(resized).observe(editRef.current, {
      attributes: true, attributeFilter: [ "style" ]
     });
  }, []);

  return (
    <div style={{maxHeight: "300px", maxWidth: '400px'}}>
      <textarea ref={editRef} id="editing" spellCheck="false" defaultValue={`!Yolo Swaggings
        :FEs

        What is red?
        a. a color
        b. a number
        ans: a
        `}
        onInput={(e)=>{
          setText(e.target.value);
          setScroll({top: e.target.scrollTop, left: e.target.scrollLeft});
        }}
        onChange={(e)=>setScroll({top: e.target.scrollTop, left: e.target.scrollLeft})}
        onScroll={(e)=>{
          setScroll({top: e.target.scrollTop, left: e.target.scrollLeft});
        }}
        onKeyDown={(e)=>{
          check_tab(e.target, e, setText);
          setScroll({top: e.target.scrollTop, left: e.target.scrollLeft});
        }}
      >
      </textarea>
      <pre ref={preRef} id="highlighting" aria-hidden="true">
          {text}<br/>
      </pre>
    </div>
  );
}

export default App;
