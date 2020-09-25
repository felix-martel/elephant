import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Checklist from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import List from '@editorjs/list';
import Underline from '@editorjs/underline';
import Table from '@editorjs/table';
import Marker from '@editorjs/marker';
import {EditorStore} from './storage.js';

import './style.scss';

const SAVE_DELAY = 20 * 1000;
const mainContainer = document.getElementById('editor');

let isFirstFocus = true;
window.addEventListener('focus', e => {
  console.log('focus');
  if (isFirstFocus){
    removeBlur();
    isFirstFocus = false
  }
});

function toggleBlur(){
    mainContainer.classList.toggle("blurry");
}
function removeBlur(){
  mainContainer.classList.remove("blurry");
}

window.addEventListener("keydown", e => {
    if (e.keyCode === 27){
        toggleBlur();
    }
});

const store = new EditorStore();
store.getCachedContent()
  .then(data => {
    console.debug("Initial data:", data);
    if (!data){
      // Blurring an empty text is terrible UX
      removeBlur();
    }
    const editor = new EditorJS({
      holder: "editor",
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2],
            defaultLevel: 2,
          },
        },
        checklist: Checklist,
        delimiter: Delimiter,
        list: List,
        underline: Underline,
        table: Table,
        marker: Marker
      },
      autofocus: true,
      data: data,
      onReady: () => {
          // Save journal every `SAVE_DELAY` milliseconds
          window.setInterval(() => {
              console.debug("Auto-saving...");
              editor.save().then(data => {
                  store.setCachedContent(data);
                });
          }, SAVE_DELAY);
          // Save journal on page leave
          window.addEventListener("unload", () => {
              console.debug("Saving on leave");
              editor.save().then(data => {
                  store.setCachedContent(data);
                });
          });
      }
  });
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === "append") {
        console.log("Append block", request.block);
        const {type, data} = request.block;
        editor.blocks.insert(type, data, {}, editor.blocks.getBlocksCount());
        sendResponse(true);
      }
    }
  );
})
