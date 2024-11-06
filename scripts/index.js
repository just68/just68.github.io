fetch('/data.json', {method: "GET"})
.then(response => {
    if (response.ok) {
        return response.json()
    }
})
.then(json => {
    initPage(json);
})
.catch(error => {
    showError(error);
})

function initPage(JSONdata) {
    fetch('/main.html', {method: "GET"})
    .then(response => {
        return response.text()
    })
    .then(html => {
        document.head.innerHTML += `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles/styles.css">`;
        document.body.innerHTML = html;
        const data = JSONdata;
        let currentPageID = sessionStorage.getItem('currentPageID') == undefined ? 0 : sessionStorage.getItem('currentPageID');
        let currentPageTitle = data[Object.keys(data)[1]][currentPageID].title;
        let currentPageLink = data[Object.keys(data)[1]][currentPageID].link + 'index.html';
        createPage(document.querySelector('#page'), ['pageTitle', 'pageContent']);
        showPage(document.querySelector('#pageTitle'), document.querySelector('#pageContent'), currentPageTitle, currentPageLink);
        createNavSections(document.querySelector('#nav'), data[Object.keys(data)[0]], ['nav-list', 'nav-list-title', 'nav-list-inner']);
        fillNavSections(document.querySelectorAll('.nav-list-inner'), data[Object.keys(data)[1]], ['nav-list-item']);
        fillEmptyNavSections(document.querySelectorAll('.nav-list-inner'), ['nav-list-item', 'inactive-nav-list-item']);
    })
    .catch(error => {
        showError(error);
    })
}

function showError(errorMessage) {
    document.write(`Network error: reload page (${errorMessage})`);
}

function createPage(pageElem, idList) {
    const pageTitle = document.createElement('p');
    pageTitle.id = idList[0];
    const pageContent = document.createElement('div');
    pageContent.id = idList[1];
    pageElem.appendChild(pageTitle);
    pageElem.appendChild(pageContent);
}

function showPage(titleElem, contentElem, title, link) {
    titleElem.innerHTML = title;
    fetch(link, {method: "GET"})
    .then(response => {
        return response.text()
    })
    .then(html => {
        fixPageContentHeight(document.querySelector('header'), document.querySelector('main'));
        initSidebarMove(document.querySelector('#page'), document.querySelector('#sidebar'), document.querySelector('#sidebarToggle'), document.querySelector('#sidebarToggleIcon'));
        contentElem.innerHTML = html;
    })
    .catch(error => {
        showError(error);
    })
}

function fixPageContentHeight(headerElem, contentElem) {
    contentElem.style.minHeight = `calc(100vh - ${headerElem.offsetHeight}px)`;
}

function createNavSections(navElem, data, classList) {
    for (let i = 0; i < data.length; i++) {
        let navSection = document.createElement('div');
        navSection.classList.add(classList[0]);
        let navSectionTitle = document.createElement('p');
        navSectionTitle.classList.add(classList[1]);
        let navSectionList = document.createElement('ol');
        navSectionList.classList.add(classList[2]);
        navElem.appendChild(navSection);
        navSection.appendChild(navSectionTitle);
        navSection.appendChild(navSectionList);
        navSectionTitle.innerHTML = data[i][Object.keys(data[i])[0]];
    }
}

function fillNavSections(navListsElem, data, classList) {
    for (let i = 0; i < data.length; i++) {
        let navListItem = document.createElement('li');
        navListItem.classList.add(classList[0]);
        navListsElem[Number(data[i][Object.keys(data[i])[0]])].appendChild(navListItem);
        navListItem.innerHTML = data[i][Object.keys(data[i])[2]];
        navListItem.addEventListener('click', function() {
            let pageTitle = data[i].title;
            let pageLink = data[i].link + 'index.html';
            showPage(document.querySelector('#pageTitle'), document.querySelector('#pageContent'), pageTitle, pageLink);
            sessionStorage.setItem('currentPageID', i);
        });
    }
}
function fillEmptyNavSections(navListsElem, classList) {
    for (let i = 0; i < navListsElem.length; i++) {
        if (navListsElem[i].innerHTML == "") {
            let navListItem = document.createElement('li');
            navListItem.classList.add(classList[0]);
            navListItem.classList.add(classList[1]);
            navListsElem[i].appendChild(navListItem);
            navListItem.innerHTML = '<i>nothing yet</i>';
        }
    }
}

function initSidebarMove(content, sidebar, sidebarToggle, sidebarToggleIcon) {
    let isOnSmallScreen;
    let isSidebarOpened;
    function toggleDefaultSidebarPos() {
        isOnSmallScreen = document.documentElement.clientWidth > 1000 ? false : true;
        if (isOnSmallScreen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
    toggleDefaultSidebarPos();
    window.addEventListener('resize', toggleDefaultSidebarPos);
    sidebarToggle.addEventListener('click', toggleSidebar);
    function toggleSidebar() {
        if (isSidebarOpened) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
    function openSidebar() {
        sidebarToggleIcon.style.opacity = 0;
        sidebarToggleIcon.src = 'src/icons/close_menu_icon_24.svg';
        sidebarToggleIcon.style.opacity = 1;
        sidebar.style.left = 0;
        if (isOnSmallScreen) {
            content.style.marginLeft = sidebarToggle.offsetWidth + 'px';
            console.log(content.style.marginLeft)
        } else {
            content.style.marginLeft = sidebar.offsetWidth + 'px';
            console.log(content.style.marginLeft)
        }
        isSidebarOpened = true;
    }
    function closeSidebar() {
        sidebarToggleIcon.style.opacity = 0;
        sidebarToggleIcon.src = 'src/icons/menu_icon_24.svg';
        sidebarToggleIcon.style.opacity = 1;
        sidebar.style.left = -sidebar.clientWidth + sidebarToggle.offsetWidth + 'px';
        if (isOnSmallScreen) {
            content.style.marginLeft = sidebarToggle.offsetWidth + 'px';
            console.log(content.style.marginLeft)
        } else {
            content.style.marginLeft = sidebarToggle.offsetWidth + 'px';
            console.log(content.style.marginLeft)
        }
        isSidebarOpened = false;
    }
}

function fixSidebarWidth() {

}

function fixSidebarHeight() {

}