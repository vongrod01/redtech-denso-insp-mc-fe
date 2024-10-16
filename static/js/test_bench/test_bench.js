const MENU_DASHBOARD = 0
const MENU_DATA_BROWSING = 1
const MENU_3 = 2
let ActiveProcess = [
    {
        ActiveMenu: false,
        TabNameActive: ''
    },
    {
        ActiveMenu: false,
        TabNameActive: ''
    },
    {
        ActiveMenu: false,
        TabNameActive: ''
    },
]
function ActiveMenuStatus(menuIdx, tabName) {
    ActiveProcess.forEach(o => {
        o.ActiveMenu = false
        o.TabNameActive = tabName !== null ? '' : o.TabNameActive
    });
    ActiveProcess[menuIdx].ActiveMenu = true
    ActiveProcess[menuIdx].TabNameActive = tabName !== null ? tabName : ActiveProcess[menuIdx].TabNameActive
}

function activeTabMenuDashboard(menuStr) {

    if (menuStr === 'daily') {
        root_css.style.setProperty('--theme-tab-dshboard-color', 'var(--theme-chart-daily-color)');
        root_css.style.setProperty('--theme-tab-dshboard-font-color', 'var(--theme-chart-daily-font-color)');
        ActiveMenuStatus(MENU_DASHBOARD, 'Daily Performance')
    }
    else if (menuStr === 'monthly') {
        root_css.style.setProperty('--theme-tab-dshboard-color', 'var(--theme-chart-monthly-color)');
        root_css.style.setProperty('--theme-tab-dshboard-font-color', 'var(--theme-chart-monthly-font-color)');
        ActiveMenuStatus(MENU_DASHBOARD, 'Monthly Performance')
    }
}
function activeTabMenuDataBrowsing(menuStr) {

    if (menuStr === 'date') {
        root_css.style.setProperty('--theme-tab-data-browsing-color', 'var(--theme-table-date-color)');
        root_css.style.setProperty('--theme-tab-data-browsing-font-color', 'var(--theme-table-date-font-color)');
        ActiveMenuStatus(MENU_DATA_BROWSING, 'By Date')
    }
    else if (menuStr === 'serial') {
        root_css.style.setProperty('--theme-tab-data-browsing-color', 'var(--theme-table-serial-color)');
        root_css.style.setProperty('--theme-tab-data-browsing-font-color', 'var(--theme-table-serial-font-color)');
        ActiveMenuStatus(MENU_DATA_BROWSING, 'By Serial')
    }
}

// window.onkeydown = function (ev) {
//     if (ActiveProcess[MENU_DASHBOARD].ActiveMenu && ActiveProcess[MENU_DASHBOARD].TabNameActive === 'Chart View') {

//         if (ev.ctrlKey && ev.code == 'ArrowRight') {
//             controlChart_LastItem()
//         }
//         else if (ev.ctrlKey && ev.code == 'ArrowLeft') {
//             controlChart_FirstItem()
//         }
//         else if (ev.code == 'ArrowRight') {
//             controlChart_NextItem()
//         }
//         else if (ev.code == 'ArrowLeft') {
//             controlChart_PreviousItem()
//         }

//     }

// };



