import './App.css';
import { useEffect, useRef, useState } from 'react';




const calcNewSize = (editRef, canvasRef, size, lineHeight, scale) => {
    const newHeight = editRef.current.offsetHeight;
    const ctx = canvasRef.current.getContext('2d', { antialias: false, depth: false });
    ctx.font = String(lineHeight-3) + 'px monospace';

    const firstLine = Math.floor(editRef.current.scrollTop / lineHeight);
    const lastLine = firstLine + Math.ceil(editRef.current.offsetHeight / lineHeight);
    let { width: newWidth } = ctx.measureText(String(Math.max(lastLine, 9999)));
    newWidth += 4;
    if (newHeight !== size.height || newWidth !== size.width || scale!==size.scale) {
        return { width: newWidth, height: newHeight, scale };
    }
    return null;
}

function App({lineHeight=20, lineColorList}) {
    const editRef = useRef();
    const canvasRef = useRef();
    const [text, setText] = useState('');
    const [scroll, setScroll] = useState({ top: 0, left: 0 });
    const [size, setSize] = useState({ width: 0, height: 0, pixelRatio: 1 })
    const [repaint, setRepaint] = useState({});

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            setRepaint({});
        });

        resizeObserver.observe(editRef.current);
        const editRefCurrent = editRef.current;
        return () => resizeObserver.unobserve(editRefCurrent);
    }, []);

    useEffect(() => {
        const newSize = calcNewSize(editRef, canvasRef, size, lineHeight, window.devicePixelRatio);
        if (newSize) {
            setSize(newSize);
            return;
        }

        const drawW=size.width*size.scale;
        const drawH=size.height*size.scale;
        const drawLineHeight=lineHeight*size.scale;

        const ctx = canvasRef.current.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, drawW, drawH);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = String(drawLineHeight) + 'px monospace';

        const firstLine = Math.floor(editRef.current.scrollTop / lineHeight);
        const lastLine = firstLine + Math.ceil(editRef.current.offsetHeight / lineHeight);
        let drawY = (Math.floor(editRef.current.scrollTop / lineHeight) - editRef.current.scrollTop / lineHeight) * drawLineHeight+1*size.scale;

        for (let line = firstLine; line < lastLine; line++) {
            ctx.fillStyle = lineColorList[line+1] ? lineColorList[line+1].bg : line%2?'#1a1a1a':'#141414';
            ctx.fillRect(0, drawY, drawW, drawLineHeight);
            if (line+1>0){
                ctx.fillStyle = lineColorList[line+1] ? lineColorList[line+1].fg :"#eeeeee";
                ctx.fillText(String(line + 1), drawW / 2, drawY+drawLineHeight/2+1);
            }
            drawY += drawLineHeight;
        }

        ctx.beginPath();
        ctx.strokeStyle='#aaaaaa';
        ctx.moveTo(drawW-1, 0);
        ctx.lineTo(drawW-1, drawH);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, drawH);
        ctx.stroke();
    }, [size, scroll, text, repaint, lineHeight, lineColorList])


    return (
        <>
        <div className='component' style={{ width: '100%', height: '100%' }}>
            <div style={{margin: 0, border: '2px', borderColor:'black'}}>
            <canvas ref={canvasRef} className='highlighter' width={size.width*size.scale} height={size.height*size.scale} style={{ width: size.width, height: size.height }}></canvas>
            </div>
            <textarea ref={editRef} className='editor' spellCheck="false" style={{fontSize: (lineHeight-3)+'px', lineHeight: lineHeight+'px'}} defaultValue={`
!Yolo Swaggings

:FEs

    What is red?
    a. a color
    b. a number
    ans: a

    What is blue?
    *a. a color
    b. a number 
`}
                onInput={(e) => {
                    setText(e.target.value);
                    setScroll({ top: e.target.scrollTop });
                }}
                onChange={(e) => setScroll({ top: e.target.scrollTop })}
                onScroll={(e) => {
                    setScroll({ top: e.target.scrollTop });
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        document.execCommand('insertText', false, '    ');
                    }
                    setScroll({ top: e.target.scrollTop });
                }}
            >
            </textarea>
        </div>
        </>
    );
}

export default App;
