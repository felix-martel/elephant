import {EditorStore} from './storage.js';

const MENU_ID = "add-to-elephant";
const store = new EditorStore();

// Register context menu
chrome.contextMenus.onClicked.addListener(onClick);
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Add to Elephant",
    contexts: ["page", "link", "selection", "image"]
  })
});

function sendMessage(...args) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(...args, response => {
      resolve(response);
    });
  })
}

chrome.commands.onCommand.addListener((command, tab) => {
  if (command !== 'add-to-elephant') { return }
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if (!tabs){ return }
    // Get active tab
    const activeTab = tabs[0];
    console.log(activeTab);
    chrome.tabs.executeScript(activeTab.id, {
      code: 'window.getSelection().toString()'
    }, selected => {
      const url = activeTab.url;
      console.log(url);
      console.log(selected);
      const block = selected ? makeParagraph(selected, url) : makeLink(url, activeTab.title);
      appendBlock(block);
    });
  })
});


function onClick(info, tab) {
  console.log(info);
  const pageUrl = info.pageUrl;
  console.log("Clicked on", pageUrl);

  let block;
  if (info.menuItemId === MENU_ID) {
    if (info.linkUrl || info.srcUrl) {
      // Add link
      const url = info.linkUrl || info.srcUrl;
      console.log("Adding link", url, "to Elephant");
      block = makeLink(url);
    }
    else if (info.selectionText){
      const text = info.selectionText;
      console.log("Adding text", text, "to Elephant");
      block = makeParagraph(text, pageUrl);
    }
    else {
      let title;
      if (tab && tab.title) {
        title = tab.title;
      }
      console.log("Adding page", pageUrl, "to Elephant");
      block = makeLink(pageUrl, title);
    }
    appendBlock(block);
  }
}

function appendBlock(block){
  chrome.tabs.query({url: "chrome://newtab/"}, tabs => {
    if (!tabs){
      store.appendBlock(block);
    }
    else {
      Promise.all(tabs.map(tab => sendMessage(tab.id, {type: "append", block: block})))
        .then(responses => {
          console.log("Responses:", responses);
          if (!responses.some(x => Boolean(x))) {
            store.appendBlock(block);
          }
        });
    }
  })
}

function makeParagraph(text, src){
  if (src) {
    text += ` <a class="external" href="${src}">[source]</a>`;
  }
  return {
    data: {
      text: text
    },
    type: "paragraph"
  }
}

function makeLink(url, name){
  if (!name){
    name = url.replace(/https?:\/\//, "");
  }
  const text = `<a href="${url}">${name}</a>`;
  return {
    data: {text: text},
    type: "paragraph",
  }
}
