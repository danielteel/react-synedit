import './App.css';
import { useEffect, useRef, useState } from 'react';




const calcNewSize = (editRef, canvasRef, size, lineHeight) => {
    const newHeight = editRef.current.offsetHeight;
    const ctx = canvasRef.current.getContext('2d', { antialias: false, depth: false });
    ctx.font = String(lineHeight-3) + 'px monospace';

    const firstLine = Math.floor(editRef.current.scrollTop / lineHeight);
    const lastLine = firstLine + Math.ceil(editRef.current.offsetHeight / lineHeight);
    let { width: newWidth } = ctx.measureText(String(Math.max(lastLine, 9999)));
    newWidth += 4;
    if (newHeight !== size.height || newWidth !== size.width) {
        return { width: newWidth, height: newHeight };
    }
    return null;
}

function App({lineHeight=20, lineColorList}) {
    const editRef = useRef();
    const canvasRef = useRef();
    const [text, setText] = useState('');
    const [scroll, setScroll] = useState({ top: 0, left: 0 });
    const [size, setSize] = useState({ width: 0, height: 0 })
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
        const newSize = calcNewSize(editRef, canvasRef, size, lineHeight);
        if (newSize) {
            setSize(newSize);
            return;
        }

        const ctx = canvasRef.current.getContext('2d', { antialias: false, depth: false });
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size.width, size.height);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = String(lineHeight-1) + 'px monospace';

        const firstLine = Math.floor(editRef.current.scrollTop / lineHeight);
        const lastLine = firstLine + Math.ceil(editRef.current.offsetHeight / lineHeight);
        let drawY = (Math.floor(editRef.current.scrollTop / lineHeight) - editRef.current.scrollTop / lineHeight) * lineHeight;

        for (let line = firstLine; line < lastLine; line++) {
            ctx.fillStyle = line%2?'#292929':'#111111';
            ctx.fillRect(0, drawY, size.width, lineHeight);
            if (line+1>0){
                ctx.fillStyle = "#eeeeee";
                ctx.fillText(String(line + 1), size.width / 2, drawY+lineHeight/2+1);
            }
            drawY += lineHeight;
        }

        ctx.beginPath();
        ctx.strokeStyle='#aaaaaa';
        ctx.moveTo(size.width-1, 0);
        ctx.lineTo(size.width-1, size.height);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size.height);
        ctx.stroke();
    }, [size, scroll, text, repaint, lineHeight])


    return (
        <>
        <div className='component' style={{ width: '100%', height: '100%' }}>
            <div style={{margin: 0, border: '2px', borderColor:'black'}}>
            <canvas ref={canvasRef} className='highlighter' width={size.width} height={size.height} style={{ width: size.width, height: size.height }}></canvas>
            </div>
            <textarea ref={editRef} className='editor' spellCheck="false" style={{fontSize: (lineHeight-3)+'px', lineHeight: lineHeight+'px'}} defaultValue={`!Yolo Swaggings
        :FEs

        What is red?
        a. a color
        b. a number
        ans: a
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
