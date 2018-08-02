// TODO add color to tabs or some other tracking
// TODO prevent focus lost if possible
// TODO suspend tab when not used for a while (add snooze icon)
// TODO enable storing and restoring tabs
// TODO show timeline for all tab activity (open, close, focus, unfocus)
// TODO undo close/action
// TODO support closing tab via keyboard
// TODO prevent cursor moving when pressing up/down
// TODO add history search to end of search?
// TODO add option to search google in search function?

Breeze = {};

Breeze.pastel = num => {
    const colors = [ '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff' ];
    // Support negative numbers
    const index = (num + colors.length) % colors.length;
    return colors[index];
};

Breeze.setup = () => {
    chrome.tabs.onCreated.addListener(() => Breeze.updateTabs());
    chrome.tabs.onMoved.addListener(() => Breeze.updateTabs());
    chrome.tabs.onRemoved.addListener(() => Breeze.updateTabs());
    chrome.tabs.onDetached.addListener(() => Breeze.updateTabs());
    chrome.tabs.onAttached.addListener(() => Breeze.updateTabs());

    // Setup search
    $(`#search`).keydown(Breeze.navigate);
    $(`#search`).keyup(Breeze.search);
    $(`#search`).focus();

    // Setup initial tabs
    Breeze.updateTabs();
};

// TODO prevent keyup
Breeze.navigate = (evt) => {
    console.log("navigating");

    const tabContainer = Breeze.isSearching() ? $('#search_results_container') : $('#main_container');
    const tabs = tabContainer.find('.tab');
    const visibleTabs = tabContainer.find('.tab:visible');

    const selectedTab = tabContainer.find('.tab_selected');
    const hasSelectedTab = selectedTab.length !== 0;

    switch (evt.key) {
        case 'Enter':
            if (hasSelectedTab) {
                const tabId = parseInt(selectedTab.attr('tabid'));
                Breeze.focusTab(tabId);
            }
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            const down = evt.key === 'ArrowDown';
            const numVisibleTabs = visibleTabs.length;
            var visibleIndex;

            if (hasSelectedTab) {
                // Determine the new index, deselect the old element
                const increment = down ? 1 : -1;
                const currentVisibleIndex = visibleTabs.index(selectedTab);
                visibleIndex = (currentVisibleIndex + increment + numVisibleTabs) % numVisibleTabs;
            } else {
                // Select first visible
                visibleIndex = down ? 0 : numVisibleTabs - 1;
            }

            // Select the new element (skip if no tabs)
            if (numVisibleTabs > 0) {
                const tabIndex = tabs.index(visibleTabs[visibleIndex]);
                Breeze.navigateToTab($(tabs[tabIndex]), tabContainer);
            }
            break;
    }
};

Breeze.navigateToTab = (tab, container) => {
    // Clear any currently selected tabs
    console.log("navigating to tab");
    container.find('.tab_selected').removeClass('tab_selected');
    tab.addClass('tab_selected');
};

Breeze.selectFirstTabIfNoneSelected = (container) => {
    const visibleTabs = container.find('.tab:visible');
    const hasSelectedTab = container.find('.tab_selected:visible').length > 0;
    if (visibleTabs.length > 0 && !hasSelectedTab) {
        Breeze.navigateToTab(container.find('.tab:visible').first(), container);
    }
}

Breeze.isSearching = () => {
    return $(`#search`).val().length > 0;
};

Breeze.search = evt => {
    console.log("searching");

    const rawFilter = $(`#search`).val();
    const hasFilter = rawFilter.length > 0;

    const searchResults = $('#search_results_container');

    $('#main_container').toggle(!hasFilter);
    searchResults.toggle(hasFilter);

    const filter = rawFilter.trim().toUpperCase();
    if (filter.length === 0) {
        return;
    }

    const searchTabs = searchResults.find('.tab');
    searchTabs.each((index, t) => {
        const tab = $(t);
        const matches = tab.find('.tab_title').text().toUpperCase().includes(filter);
        tab.toggle(matches);
    });

    Breeze.selectFirstTabIfNoneSelected(searchResults);
}

Breeze.createTabElement = (tab) => {
    const tabElem = $(`<div class="item tab" tabId='${tab.id}'></div>`);
    if (tab.active) {
        tabElem.addClass('tab_active');
    }
    const favIconUrl = tab.favIconUrl ? tab.favIconUrl : 'no_favicon.png';
    tabElem.append($(`<img class="tab_favicon" src="${favIconUrl}" />`));
    tabElem.append($(`<div class="tab_title">${tab.title}</div>`));
    tabElem.append($(`<div class="tab_close"></div>`).click(() => Breeze.closeTab(tabElem, tab.id)));
    tabElem.dblclick(() => Breeze.focusTab(tab.id));
    return tabElem;
};

Breeze.focusTab = tabId => {
    chrome.tabs.update(tabId, { active: true });
};

Breeze.closeTab = (elem, tabId) => {
    chrome.tabs.remove(tabId);
    elem.remove();
};

Breeze.closeWindow = windowId => chrome.windows.remove(windowId);

Breeze.moveTab = (tabId, toWindowId, index) => {
    chrome.tabs.move(tabId, {windowId: toWindowId, index: index});
}

Breeze.createNewWindow = tabId => chrome.windows.create({ tabId: tabId, focused: false });

Breeze.updateTabs = () => {
    chrome.tabs.query({}, tabs => {
        console.log("rebuilding tabs");

        const windowNames = new Map();
        const tabMap = new Map();

        tabs.forEach(tab => {
            if (!tabMap.has(tab.windowId)) {
                windowNames.set(tab.windowId, `Window ${tabMap.size + 1}`);
                tabMap.set(tab.windowId, []);
            }

            tabMap.get(tab.windowId).push(tab);
        });

        const moveTab = evt => {
            const windowIdTo = parseInt(evt.to.getAttribute('windowid'));
            const tabId = parseInt(evt.item.getAttribute('tabid'));
            const index = evt.newIndex;

            chrome.tabs.move(tabId, { windowId: windowIdTo, index: index });
        };

        const createWindow = evt => {
            const tabId = parseInt(evt.item.getAttribute('tabid'));
            Breeze.createNewWindow(tabId);
        };

        const container = $(`#main_container`);
        container.empty();

        const newWindow = $(`<div class="windows_container" id="new_window"><div class="title_container">New Window</div></div>`);
        Sortable.create(newWindow[0], {
            animation: 100,
            draggable: ".tab",
            ghostClass: "sortable-ghost",
            group: 'tabs',
            onAdd: createWindow,
        });
        newWindow.hide();
        const dragStart = () => newWindow.show();
        const dragStop = () => newWindow.hide();

        tabMap.forEach((tabs, windowId) => {
            const win = $(`<div class="windows_container" windowId='${windowId}'></div>`)
            win.css("background-color", Breeze.pastel(windowId));

            const title_container = $(`<div class="title_container"></div>`)
            title_container.append($(`<div class="window_title">${windowNames.get(windowId)}</div>`));
            
            // TODO custom add window titles
            /*
            const title = $(`<input class="window_title" type="text" placeholder="${windowNames.get(windowId)}">`);
            title.keyup(() => {
                // TODO save this in storage
                windowNames.set(windowId, title.val());
            });
            title_container.append(title);
            */

            title_container.append($(`<div class="tab_close"></div>`).click(() => Breeze.closeWindow(windowId)));
            win.append(title_container);
            
            tabs.forEach(tab => {
                win.append(Breeze.createTabElement(tab));
            });

            container.append(win);

            Sortable.create(win[0], {
                animation: 100,
                draggable: ".tab",
                ghostClass: "sortable-ghost",
                group: 'tabs',
                onUpdate: moveTab,
                onAdd: moveTab,
                onStart: dragStart,
                onEnd: dragStop,
            });
        });

        container.append(newWindow);

        // Populate search
        // TODO don't clear if currently searching?
        const searchResults = $('#search_results_container');
        searchResults.empty();
        tabs.sort(((lhs, rhs) => lhs.title.localeCompare(rhs.title)))
            .forEach(tab => {
                searchResults.append(Breeze.createTabElement(tab));
            });
        Breeze.search();
    });
}