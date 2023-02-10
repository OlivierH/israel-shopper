chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';

items = [7290003029815, 7290107932080, 7290102392094]
already_clicked = []

const PRODUCT_BOUGHT = 1;
const PAGE_NOT_LOADED_YET = 2;
const PRODUCT_NOT_AVAILABLE = 3;

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    async function buyItem(item) {
        const PRODUCT_BOUGHT = 1;
        const PAGE_NOT_LOADED_YET = 2;
        const PRODUCT_NOT_AVAILABLE = 3;
        console.log("injected")
        const main = document.getElementById("main-product-modal___BV_modal_body_");
        console.log(main)
        if (!main) {
            return PAGE_NOT_LOADED_YET;
        }
        await new Promise(r => setTimeout(r, 1000));

        if (document.getElementsByClassName("not-available-strip").length > 0) {
            return PRODUCT_NOT_AVAILABLE;
        }
        console.log("Ready!")
        plus = main.getElementsByClassName("plus")[0];

        result = await chrome.storage.local.get(["items_selected"]);
        items_selected = result.items_selected + [item]
        plus.click();
        await new Promise(r => setTimeout(r, 1000));

        return PRODUCT_BOUGHT;
    }

    if (changeInfo.status == 'complete' && tab.url.startsWith("https://www.rami-levy.co.il/")) {
        console.log("Tab loaded, url = " + tab.url)
        // parts = tab.url.split('=');
        const url = new URL(tab.url);
        const urlParams = new URLSearchParams(url.search);
        const item = urlParams.get('item') * 1;
        results = await chrome.storage.local.get(["items", "items_selected"]);

        if (!results.items.includes(item) || results.items_selected.includes(item)) {
            return;
        }
        let next = undefined;
        for (const potential_next of results.items) {
            if (potential_next == item) {
                continue;
            }
            if (results.items_selected.includes(potential_next)) {
                continue;
            }
            next = potential_next;
            break;
        }
        const buy_result = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: buyItem,
            args: [item],
        });
        const status = buy_result[0].result;
        console.log("status = " + status)
        if (status == PRODUCT_BOUGHT || status == PRODUCT_NOT_AVAILABLE) {

            await chrome.storage.local.set({ items_selected: results.items_selected + [item] });
            await chrome.tabs.update(tab.id, { url: "https://www.rami-levy.co.il/he/online/market/?item=" + next });
            console.log("after tab update")
        }
        // do your things

    }
})

chrome.action.onClicked.addListener(async (tab) => {
    results = await chrome.storage.local.get(["items"]);
    console.log("Value currently is " + results.items);
    if (results.items == undefined) {
        console.log("setting value");
        await chrome.storage.local.set({ itemsitems: [7290003029815, 7290107932080, 7290102392094], items_selected: [] });
    }
});
// chrome.action.onClicked.addListener(async (tab) => {
//     function injectedFunction() {
//         console.log("injected")
//         // const main = document.getElementById("main-product-modal___BV_modal_body_");
//         // if (main) {
//         //     plus = main.getElementsByClassName("plus")[0];
//         //     console.log(plus)
//         // }
//     }

//     // if (tab.url.startsWith("https://rami")) {
//     // chrome.scripting.executeScript({
//     //     target: { tabId: tab.id },
//     //     func: injectedFunction
//     // });
//     // }
//     console.log("before query");

//     chrome.tabs.query({ currentWindow: true, active: true }, async tab => {
//         console.log("inside query");

//         const tab_id = tab[0].id
//         await chrome.tabs.update(tab.id, { url: "https://www.rami-levy.co.il/he/online/market/%D7%97%D7%9C%D7%91-%D7%91%D7%99%D7%A6%D7%99%D7%9D-%D7%95%D7%A1%D7%9C%D7%98%D7%99%D7%9D?item=7290107932080" });
//         console.log("after update ");

//         // // await onTabUrlUpdated(tab.id);

//         chrome.scripting.executeScript({
//             target: { tabId: tab_id },
//             func: injectedFunction
//         });
//     });
//     // console.log("AAA");
//     // if (tab.url.startsWith("https://rami")) {
//     //     chrome.scripting.executeScript({
//     //         target: { tabId: tabId },
//     //         func: injectedFunction
//     //     });
//     // }
//     // if (tab.url.startsWith("chrome://extensions") || tab.url.startsWith(webstore) || tab.url.startsWith(extensions)) {
//     //     // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//     //     const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//     //     // Next state will always be the opposite
//     //     const nextState = prevState === 'ON' ? 'OFF' : 'ON'

//     //     // Set the action badge to the next state
//     //     await chrome.action.setBadgeText({
//     //         tabId: tab.id,
//     //         text: nextState,
//     //     });
//     // }
// });