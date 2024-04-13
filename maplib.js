/******************************************************* */
/* common vars */
/******************************************************* */
const stdlog = console.log;
let currentCursor = { X: null, Y: null, w: null, h: null };
let mouseDownCursor = { X: null, Y: null, w: null, h: null };
let rectProps = { X: null, Y: null, w: null, h: null };
let isMouseDown = false;
let mode = "shape"; // shape, draw, text
let modeName = "rectangle" // rectangle
let modeDetail = "fill" // outlined, filled
let modeColor = "" // any color; currently supports color name

/******************************************************* */
/* main */
/******************************************************* */
const InitializeMaplib = (  height=window.innerHeight, 
                            width=window.innerWidth, 
                            zindex=null, 
                            position=null, 
                            border=null
                         ) => 
{
    // create canvas
    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.height = height;
    canvas.width = width;
    if(!!zindex) canvas.style.zIndex = zindex;
    if(!!position) canvas.style.position = position;
    if(!!border) canvas.style.border = border;


    // add canvas to requested div by client
    var clientDiv = document.getElementById("maplib-canvas");
    
    if(canvas.getContext && !!clientDiv) {
        stdlog('canvas ctx created!!');

        // append canvas to clientDiv
        clientDiv.appendChild(canvas);

        // get context
        var ctx = canvas.getContext("2d");

        // add event listeners
        AddCanvasEventListeners(canvas, ctx, mode="shape", modeName="rectangle", modeDetail="fill", modeColor="green");
    }
    else 
        throw new Error('Error occurred while creating canvas');
}

/******************************************************* */
/* event listeners */
/******************************************************* */
const AddCanvasEventListeners = (canvas, ctx, mode, modeName, modeDetail, modeColor) => {
    stdlog("adding event listeners!!", canvas);

    // rect event listeners
    if(mode == "shape" && modeName == "rectangle" && modeDetail == "fill") 
    {
        canvas.addEventListener("mousemove", function(e) {
            StoreCursorPosition(canvas, e);
    
            if(isMouseDown)
            {
                // store main height and width of rect initially
                let mw = Math.abs(currentCursor.X-mouseDownCursor.X);
                let mh = Math.abs(currentCursor.Y-mouseDownCursor.Y);
        
                // clear the prev rect
                ctx.fillStyle = ("white");
                if(!!rectProps.X && !!rectProps.Y && !!rectProps.w && !!rectProps.h)
                {
                    ctx.clearRect(rectProps.X, rectProps.Y, rectProps.w, rectProps.h);
                }
                
                // draw filled rectangle
                ctx.fillStyle = (`${modeColor}`);
                ctx.fillRect(mouseDownCursor.X, mouseDownCursor.Y, mw, mh);
    
                // set rectProps
                SetRectProps(mouseDownCursor.X, mouseDownCursor.Y, mw, mh);
            }   
        });
    
        canvas.addEventListener("mousedown", function(e) {
            if(!isMouseDown)
            {
                // store original co-ordinates just mouse is clicked
                mouseDownCursor.X = currentCursor.X;
                mouseDownCursor.Y = currentCursor.Y;
                isMouseDown = true;
            }
        });
    
        canvas.addEventListener("mouseup", function(e) {
            // reset mouse released flag
            isMouseDown = false;
        });
    }
}

/******************************************************* */
/* helper functions */
/******************************************************* */
const StoreCursorPosition = (canvas, event) => {
    let rect = canvas.getBoundingClientRect()
    currentCursor.X = event.clientX - rect.left;
    currentCursor.Y = event.clientY - rect.top;
}

const GetRectProps = () => { return rectProps; }

const SetRectProps = (X, Y, w, h) => {
    rectProps.X = X;
    rectProps.Y = Y;
    rectProps.w = w;
    rectProps.h = h;
}

/******************************************************* */
/* shapes */
/******************************************************* */
const DrawFilledRect = ( ctx, X, Y, w, h ) => {
    stdlog('filled rect!!');
    ctx.fillRect(X, Y, w, h);
}

const DrawStrokeRect = ( ctx, X, Y, w, h ) => {
    stdlog('outlined rect!!');
    ctx.clearRect(X, Y, w, h);
}

const DrawOutlinedRect = ( ctx, X, Y, w, h ) => {
    stdlog('cleard rect!!');
    ctx.strokeRect(X, Y, w, h);
}

/******************************************************* */
/* load api */
/******************************************************* */
// window.addEventListener('load', function () {
//     Main();
// });