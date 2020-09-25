const STORAGE_KEY = "elephantMain";
const EDITOR_VERSION = "2.18.0";

class Store {
  constructor({sync = false, key = STORAGE_KEY} = {sync: false, key: STORAGE_KEY}) {
    this.storage = sync ? chrome.storage.sync : chrome.storage.local;
    this.KEY = key;
  }

  getCachedContent() {
    return new Promise((resolve, reject) => {
      this.storage.get([this.KEY], res => {
        const data = res[STORAGE_KEY] || {};
        resolve(data);
      });
    })
  }

  setCachedContent(data) {
    return new Promise((resolve, reject) => {
      let record = {};
      record[this.KEY] = data;
      this.storage.set(record, res => {
        resolve();
      });
    })
  }
}

class EditorStore extends Store {
  appendBlock(block) {
    this.getCachedContent()
      .then(data => {
        if (!data || !data.blocks) {
          data = {
            blocks: [block],
            time: Date.now(),
            version: EDITOR_VERSION,
          }
        }
        else {
          data.blocks.push(block);
        }
        this.setCachedContent(data);
      })
  }
}

export {
  Store,
  EditorStore
}
