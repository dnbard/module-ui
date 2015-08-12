function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

document.querySelector('.header').onclick = function (e) {
    var target = e.target,
        iframeSrc = target.getAttribute('data-iframe-src'),
        element, id;

    if (iframeSrc) {
        id = 'iframe-' + guid();

        element = document.createElement('div');
        element.innerHTML = document.querySelector('#template').innerHTML;
        element.setAttribute('class', 'component component__resizable');
        element.setAttribute('id', id);
        element.style.zIndex = 11;

        element.querySelector('iframe').setAttribute('src', iframeSrc);
        element.querySelector('.component-header').innerText = iframeSrc;

        document.querySelector('.wrapper').appendChild(element);

        interact('#' + id)
            .draggable({
                onmove: dragMoveListener
            }).allowFrom('.component__dragable');;

        interact('#' + id + '.component__resizable')
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true }
            }).on('resizestart', function(e){
                console.log('Resize started');
                var a = e.target.querySelector('iframe');
                if(a){
                    a.style.pointerEvents = 'none';
                }
            }).on('resizeend', function(e){
                console.log('Resize ended');
                var a = e.target.querySelector('iframe');
                if(a){
                    a.style.pointerEvents = '';
                }
            }).on('resizemove', function (event) {
                var target = event.target,
                    x = (parseFloat(target.getAttribute('data-x')) || 0),
                    y = (parseFloat(target.getAttribute('data-y')) || 0);

                // update the element's style
                target.style.width  = event.rect.width + 'px';
                target.style.height = event.rect.height + 'px';

                // translate when resizing from top or left edges
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                target.style.webkitTransform = target.style.transform =
                    'translate(' + x + 'px,' + y + 'px)';
            });;
    }
};

document.querySelector('.wrapper').onmousedown = function(e){
    var target = e.target,
        components, el;

    if (target.classList.contains('component__dragable')){
        components = document.querySelectorAll('.component__dragable');
        for(var i = 0; i < components.length; i ++){
            el = components[i];
            el.parentNode.style.zIndex = 0;
        }

        target.parentNode.style.zIndex = 10;
    }
}

function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
