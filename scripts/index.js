import {fetchJSON} from './modules/fetch_json.js';
import {fetchHTML} from './modules/fetch_html.js';

function fixElementsSizes(elems) {
    function updateSizes() {
        elems['header_inner_shadow'].style.height = elems['header_inner'].offsetHeight + 'px';
        elems['sidebar'].style.height = window.innerHeight - elems['header_inner'].offsetHeight + 'px';
        elems['sidebar'].style.top = elems['header_inner'].offsetHeight + 'px';
        elems['page'].style.minHeight = window.innerHeight - elems['header_inner'].offsetHeight + 'px';
    }

    updateSizes();
    window.addEventListener('resize', updateSizes);
}

function showPage(pagesData, currentPageID, titleElem, contentElem, linkElem) {
    const CURRENT_PAGE_DATA = pagesData[currentPageID];

    fetchHTML(CURRENT_PAGE_DATA['url']).then(html => {
        if (html) {
            titleElem.innerHTML = CURRENT_PAGE_DATA.title;
            contentElem.innerHTML = html;
            linkElem.href = CURRENT_PAGE_DATA['url'] + 'styles.css';
            window.history.replaceState({'page_id': currentPageID}, CURRENT_PAGE_DATA['title'], `?page_id=${currentPageID}`);
        }
    });
}

function createNavSections(sectionsData, navElem, classList) {
    for (let i = 0; i < sectionsData.length; i++) {
        const SECTION_TITLE = sectionsData[i]['section_title'];

        const NAV_SECTION_ELEM = document.createElement('div');
        const NAV_SECTION_TITLE_ELEM = document.createElement('p');
        const NAV_SECTION_LIST_ELEM = document.createElement('ol');

        NAV_SECTION_ELEM.classList.add(classList[0]);
        NAV_SECTION_TITLE_ELEM.classList.add(classList[1]);
        NAV_SECTION_LIST_ELEM.classList.add(classList[2]);

        navElem.appendChild(NAV_SECTION_ELEM);
        NAV_SECTION_ELEM.appendChild(NAV_SECTION_TITLE_ELEM);
        NAV_SECTION_ELEM.appendChild(NAV_SECTION_LIST_ELEM);

        NAV_SECTION_TITLE_ELEM.innerHTML = SECTION_TITLE;
    }
}

function fillNavSections(pagesData, navListElems, classList, pageElems) {
    for (let i = 0; i < pagesData.length; i++) {
        const NAV_LIST_ITEM = document.createElement('li');
        NAV_LIST_ITEM.classList.add(classList[0]);
        navListElems[pagesData[i]['section_id']].appendChild(NAV_LIST_ITEM);
        NAV_LIST_ITEM.innerHTML = pagesData[i]['title'];

        NAV_LIST_ITEM.addEventListener('click', function() {
            if (pagesData[i]['url'].substring(0, 4) === 'http') {
                window.open(pagesData[i]['url'], '_blank');
            } else {
                showPage(
                    pagesData,
                    i,
                    pageElems.titleElem,
                    pageElems.contentElem,
                    pageElems.linkElem,
                );
            }
        });
    }
}

function fillEmptyNavSections(navListElems, classList) {
    for (let i = 0; i < navListElems.length; i++) {
        if (navListElems[i].innerHTML == "") {
            const navListItem = document.createElement('li');
            navListItem.classList.add(classList[0]);
            navListElems[i].appendChild(navListItem);
            navListItem.innerHTML = '<i>nothing yet</i>';
        }
    }
}

function initSidebarMove(sidebar, sidebarShadow, sidebarToggle, sidebarOpenIcon, sidebarCloseIcon) {
    let isOnSmallScreen;
    let isSidebarOpened = sessionStorage.getItem('isSidebarOpened') === 'true';

    function toggleDefaultSidebarPos() {
        isOnSmallScreen = document.documentElement.clientWidth > 1000 ? false : true;
        if (sessionStorage.getItem('isSidebarOpened') === null) {
            isSidebarOpened = isOnSmallScreen ? true : false;
            sessionStorage.setItem('isSidebarOpened', isSidebarOpened);
        } else {
            isSidebarOpened = sessionStorage.getItem('isSidebarOpened') === 'true';
        }

        setDefaultSidebarToggleIconPos();
        if (isSidebarOpened) {
            openSidebar();
        } else {
            closeSidebar();
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
        sessionStorage.setItem('isSidebarOpened', isSidebarOpened);
    }

    function setDefaultSidebarToggleIconPos() {
        if (isSidebarOpened) {
            sidebarCloseIcon.style.transform = 'translateX(0)';
            sidebarOpenIcon.style.transform = 'translateX(100%)';
        } else {
            sidebarCloseIcon.style.transform = 'translateX(-100%)';
            sidebarOpenIcon.style.transform = 'translateX(-100%)';
        }
    }

    function openSidebar() {
        sidebarToggle.style.border = '2px solid rgb(0, 0, 0)';
        sidebarCloseIcon.style.transform = 'translateX(0)';
        sidebarOpenIcon.style.transform = 'translateX(100%)';
        setTimeout(function() {
            sidebarToggle.style.border = '2px solid rgb(255, 255, 255)';
        }, 200);
        sidebar.style.left = '0';
        if (isOnSmallScreen) {
            sidebarShadow.style.width = '0';
        } else {
            sidebarShadow.style.width = sidebar.offsetWidth  + 'px';
        }
        isSidebarOpened = true;
    }

    function closeSidebar() {
        sidebarToggle.style.border = '2px solid rgb(0, 0, 0)';
        sidebarCloseIcon.style.transform = 'translateX(-100%)';
        sidebarOpenIcon.style.transform = 'translateX(-100%)';
        setTimeout(function() {
            sidebarToggle.style.border = '2px solid rgb(255, 255, 255)';
        }, 200);
        sidebar.style.left = -sidebar.offsetWidth + 'px';
        sidebarShadow.style.width = '0';
        isSidebarOpened = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const HTML_ELEMS = {
        elemsToFix: {
            header_inner: document.querySelector('.header-inner'),
            header_inner_shadow: document.querySelector('.header-inner-shadow'),
            sidebar: document.querySelector('.sidebar'),
            page: document.querySelector('.page-wrapper__page')
        },
        page_link: document.querySelector('.page-link-elem'),
        nav: document.querySelector('.nav'),
        page_title: document.querySelector('.page-wrapper__page-title'),
        page_content: document.querySelector('.page-wrapper__page-content'),
        nav_link_lists: '',
    }

    fixElementsSizes(HTML_ELEMS.elemsToFix);

    fetchJSON('/data.json').then(json => {
        if (json) {
            const DATA = json;
            const NAV_SECTIONS_DATA = DATA[Object.keys(DATA)[0]];
            const PAGES_DATA = DATA[Object.keys(DATA)[1]];

            let currentURL = new URL(window.location);
            let currentPageID = currentURL.searchParams.get('page_id') == undefined ? 0 : currentURL.searchParams.get('page_id');

            showPage(
                PAGES_DATA,
                currentPageID,
                HTML_ELEMS.page_title,
                HTML_ELEMS.page_content,
                HTML_ELEMS.page_link,
            );

            window.addEventListener("popstate", () => {
                currentURL = new URL(window.location);
                currentPageID = currentURL.searchParams.get('page_id') == undefined ? 0 : currentURL.searchParams.get('page_id');

                showPage(
                    PAGES_DATA,
                    currentPageID,
                    HTML_ELEMS.page_title,
                    HTML_ELEMS.page_content,
                    HTML_ELEMS.page_link,
                );
            });

            createNavSections(
                NAV_SECTIONS_DATA,
                HTML_ELEMS.nav,
                ['nav-list', 'nav-list__title', 'nav-list__inner']
            );

            HTML_ELEMS.nav_link_lists = document.querySelectorAll('.nav-list__inner');

            fillNavSections(
                PAGES_DATA,
                HTML_ELEMS.nav_link_lists,
                ['nav-list__inner-item'],
                {
                    titleElem: HTML_ELEMS.page_title,
                    contentElem: HTML_ELEMS.page_content,
                    linkElem: HTML_ELEMS.page_link
                }
            );

            fillEmptyNavSections(
                HTML_ELEMS.nav_link_lists,
                ['nav-list__inner-item_inactive']
            );

            initSidebarMove(
                document.querySelector('.sidebar'),
                document.querySelector('.sidebar-shadow'),
                document.querySelector('.header-inner__sidebar-toggle'),
                document.querySelector('.sidebar-toggle__open-icon'),
                document.querySelector('.sidebar-toggle__close-icon')
            );
        }
    });
});