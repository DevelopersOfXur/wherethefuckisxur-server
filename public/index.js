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
        cursor: 'auto',
        mapImg: 'light'
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
        cursor: 'auto',
        mapImg: 'dark'
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
        cursor: "url('images/tree.cur'),auto",
        mapImg: 'christmas'
    },
    'conversation-hearts': {
        mainTextColor: '#8628cc',
        menuTextColor: '#ff0ec0',
        specialTextColor: '#ff0ec0',
        linkTextColor: '#0b61fd',
        linkTextHoverColor: '#0ba4fd',
        footerTextColor: '#690a9a',
        mainBackgroundColor: '#f9caca',
        secondaryBackgroundColor: '#fffc76',
        blockBackgroundColor: 'rgba(66,133,244,0.3)',
        footerBackgroundColor: '#88f588',
        borderColor: '#fff',
        lineBorderColor: '#ff0ec0',
        engramUrl: 'images/conversation-heart.png',
        headerAnim: 'none',
        cursor: 'auto',
        mapImg: 'light'
    },
    'crimson-days': {
        mainTextColor: '#fba7a7',
        menuTextColor: '#fff',
        specialTextColor: '#fff',
        linkTextColor: '#fff',
        linkTextHoverColor: '#ff3e50',
        footerTextColor: '#ffffff',
        mainBackgroundColor: 'url(images/petals.gif), #61000a',
        secondaryBackgroundColor: '#d00404',
        blockBackgroundColor: '#981212',
        footerBackgroundColor: '#61000a',
        borderColor: '#fba7a7',
        lineBorderColor: '#ff3e50',
        engramUrl: 'images/cupid-bow.png',
        headerAnim: 'none',
        cursor: "url('images/heart.cur'),auto",
        mapImg: 'dark'
    }
}

function updateColors(themeName) {
    document.cookie = 'theme=' + themeName + '; path=/';
    let shaderIcon = document.getElementById('current-shader')
    if (shaderIcon){
        shaderIcon.src = document.getElementById(themeName).src;
    }
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
    let map = document.getElementById('map');
    if (map) {
        let newsrc = map.src.split('_');
        newsrc.pop()
        map.src = newsrc.join('_') + '_' + theme.mapImg + '.png';
    }
}

let themeCookie = document.cookie.replace(/(?:(?:^|.*;\s*)theme\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if (!themeCookie || themeCookie == '' || !(themeCookie in themes)) {
    updateColors('shader-dark');
} else {
    updateColors(themeCookie);
}

let shaders = document.getElementsByClassName('shader-icon');
if (shaders) {
    for (let i = 0; i < shaders.length; i++) {
        let shader = shaders[i];
        shader.addEventListener('click', event => {
            updateColors(shader.id);
        })
    }
}

function hideNav() {
    document.getElementById('nav-menu-back').style.display = 'none';
    document.getElementById('nav-menu').style.display = 'none';
}

function showNav() {
    document.getElementById('nav-menu-back').style.display = 'block';
    document.getElementById('nav-menu').style.display = 'block';
}