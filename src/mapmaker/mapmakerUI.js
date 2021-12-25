function dragElement(panelID) {
    const panel = document.getElementById(panelID)
    const dragBar = panel.getElementsByClassName("move_bar")
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (dragBar.length > 0) {
        // if present, the header is where you move the DIV from:
        dragBar[0].onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        panel.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        panel.style.top = (panel.offsetTop - pos2) + "px";
        panel.style.left = (panel.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

dragElement("main_panel")
dragElement("object_panel")