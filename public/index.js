let themes = {
    'shader-default': {
        mainTextColor: '#333',
        menuTextColor: '#333',
        specialTextColor: '#5f6f72',
        linkTextColor: '#248ea2',
        linkTextHoverColor: '#f4b400',
        footerTextColor: '#ffffff',
        mainBackgroundColor: '#f2f2f2',
        secondaryBackgroundColor: '#dfe4e5',
        blockBackgroundColor: '#ffffff',
        footerBackgroundColor: '#5f6f72',
        borderColor: '#5f6f72',
        lineBorderColor: '#c2cacc',
        engramUrl: 'images/engram.png',
        headerAnim: 'none',
        cursor: 'auto'
    },
    'shader-dark': {
        mainTextColor: '#fff',
        menuTextColor: '#fff',
        specialTextColor: '#fff',
        linkTextColor: '#33b5ce',
        linkTextHoverColor: '#f4b400',
        footerTextColor: '#ffffff',
        mainBackgroundColor: '#3c474a',
        secondaryBackgroundColor: '#2b2d2d',
        blockBackgroundColor: '#2b2d2d',
        footerBackgroundColor: '#2b2d2d',
        borderColor: '#fff',
        lineBorderColor: '#c2cacc',
        engramUrl: 'images/engram.png',
        headerAnim: 'none',
        cursor: 'auto'
    },
    'shader-christmas': {
        mainTextColor: '#2b612b',
        menuTextColor: '#fff',
        specialTextColor: '#cc0c1e',
        linkTextColor: '#4e91ff',
        linkTextHoverColor: '#f4b400',
        footerTextColor: '#ffffff',
        mainBackgroundColor: 'url(images/snow-bg.jpg)',
        secondaryBackgroundColor: '#cc0c1e',
        blockBackgroundColor: 'rgba(66,133,244,0.3)',
        footerBackgroundColor: '#2b612b',
        borderColor: '#fff',
        lineBorderColor: '#f40028',
        engramUrl: 'images/snowflake-icon.png',
        headerAnim: 'flashing 0.5s linear 0s infinite alternate',
        cursor: "url('images/tree.cur'),auto"
    }
}

function updateColors(themeName) {
    document.cookie = 'theme=' + themeName;
    document.getElementById('current-shader').src = document.getElementById(themeName).src;
    let theme = themes[themeName];
    document.body.style.setProperty('--main-text-color', theme.mainTextColor);
    document.body.style.setProperty('--menu-text-color', theme.menuTextColor);
    document.body.style.setProperty('--special-text-color', theme.specialTextColor);
    document.body.style.setProperty('--link-text-color', theme.linkTextColor);
    document.body.style.setProperty('--link-text-hover-color', theme.linkTextHoverColor);
    document.body.style.setProperty('--footer-text-color', theme.footerTextColor);
    document.body.style.setProperty('--main-background-color', theme.mainBackgroundColor);
    document.body.style.setProperty('--secondary-background-color', theme.secondaryBackgroundColor);
    document.body.style.setProperty('--block-background-color', theme.blockBackgroundColor);
    document.body.style.setProperty('--footer-background-color', theme.footerBackgroundColor);
    document.body.style.setProperty('--border-color', theme.borderColor);
    document.body.style.setProperty('--line-border-color', theme.lineBorderColor);
    document.body.style.setProperty('--header-anim', theme.headerAnim);
    document.body.style.setProperty('--cursor', theme.cursor);
    let engrams = document.getElementsByClassName('xur-engram');
    for (let i = 0; i < engrams.length; i++) {
        engrams[i].src = theme.engramUrl;
    }
}

let themeCookie = document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if (!themeCookie || themeCookie == '' || !(themeCookie in themes)) {
    updateColors('shader-dark');
} else {
    updateColors(themeCookie);
}

let shaders = document.getElementsByClassName('shader-icon');
for (let i = 0; i < shaders.length; i++) {
    let shader = shaders[i];
    shader.addEventListener('click', event => {
        updateColors(shader.id);
    })
}

let muurigrid = document.getElementById('muuri-grid');
if (muurigrid) {
    let grid = new Muuri(muurigrid, {
        layout: {
            fillGaps: true
        }
    });
}

let tooltips = document.getElementsByClassName('tooltip');
for (let i = 0; i < tooltips.length; i++) {
    let tooltip = tooltips[i];
    let item = tooltip.parentElement;
    item.addEventListener('mouseenter', (event) => {
        tooltip.classList.remove('hidden');
    })
    item.addEventListener('mouseleave', (event) => {
        tooltip.classList.add('hidden');
    })
    item.addEventListener('mousemove', (event) => {
        tooltip.style.left = (event.pageX).toString() + 'px';
        tooltip.style.top = (event.pageY).toString() + 'px';
    })
}