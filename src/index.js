import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Checklist from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import List from '@editorjs/list';
import Underline from '@editorjs/underline';
import Table from '@editorjs/table';
import Marker from '@editorjs/marker';

import './style.scss';

const STORAGE_KEY = "elephantMain";
const CACHE_NAME = "elephant-cache";
const CACHE_REQUEST = "/elephant/content.json";
const SAVE_DELAY = 20 * 1000;

function $(id){
    return document.getElementById(id);
}
function toggleBlur(){
    $('editor').classList.toggle("blurry");
}
window.addEventListener("keydown", e => {
    if (e.keyCode === 27){
        toggleBlur();
    }
});

caches.open(CACHE_NAME).then(cache => {
    console.debug("Cache opened");
    cacheLoad().then(initialData => {
        console.debug("Cache loaded");
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
            data: initialData,
            onReady: () => {
                // Save journal every `SAVE_DELAY` milliseconds
                window.setInterval(() => {
                    console.debug("Auto-saving...");
                    cacheSave(cache);
                    //save();
                }, SAVE_DELAY);
                // Save journal on page leave
                window.addEventListener("unload", () => {
                    console.debug("Saving on leave");
                    //save();
                    cacheSave(cache);
                });
            }
        });
        function cacheSave(cache) {
            editor.save().then(out => {
                const blob = new Blob([JSON.stringify(out, null, 2)], {type : 'application/json'});
                const res = new Response(blob);
                cache.put(CACHE_REQUEST, res);
            });
        }
    });
    function cacheLoad() {
        return cache.match(CACHE_REQUEST)
            .then(res => Promise.resolve(res.json()))
            .catch(err => Promise.resolve({}))
    }
});
