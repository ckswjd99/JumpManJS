const dragElement = () => {
    const floatingWindow = document.getElementById("floating_window")
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("move_bar")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("move_bar").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        floatingWindow.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || floatingWindow.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || floatingWindow.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        floatingWindow.style.top = Math.max((floatingWindow.offsetTop - pos2), 0) + "px";
        floatingWindow.style.left = Math.max((floatingWindow.offsetLeft - pos1), 0) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

dragElement(document.getElementById("floating_window"));