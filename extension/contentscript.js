Breeze = {};

Breeze.pastel = num => {
    const colors = [ '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff' ];
    // Support negative numbers
    const index = (num + colors.length) % colors.length;
    return colors[index];
};

Breeze.addBar = () => {
    const bar = document.createElement(`div`);

    bar.id = 'breeze_window_color';
    bar.style.position = 'fixed';
    bar.style.height = '4px';
    bar.style.width = '100%';
    bar.style.top = 0;
    bar.style.left = 0;
    bar.style.zIndex = 9999999;
    // TODO match to window id and update when window changes
    bar.style.backgroundColor = Breeze.pastel(1);

    document.getElementsByTagName("body")[0].appendChild(bar);
};

// Breeze.addBar();