/* ══════════════════════════════════════════
   RAKURAKU 求人自動入力 — Service Worker
   ══════════════════════════════════════════ */

const STORAGE_KEY = 'rakuraku_pending_jobs';

const URL_MAP = {
  timee:     'https://app.timee.co.jp/business',
  sharefull: 'https://business.sharefull.com/',
  baitoru:   'https://www.baitoru.com/biz/',
};

/**
 * Stash the job data in session storage, then open one tab per selected platform.
 * Each platform's content script will read from chrome.storage.session and fill the form.
 */
async function distributeJobs(data) {
  const { platforms = [], jobs = [], wage, jobText, jobTitle, template } = data || {};
  if (!platforms.length) return { success: false, error: 'no platforms' };

  await chrome.storage.session.set({
    [STORAGE_KEY]: { jobs, wage, jobText, jobTitle, template, timestamp: Date.now() },
  });

  let opened = 0;
  for (const pf of platforms) {
    const url = URL_MAP[pf];
    if (url) {
      try {
        await chrome.tabs.create({ url, active: opened === 0 });
        opened++;
      } catch (e) {
        console.error('[RAKURAKU bg] tab open failed:', pf, e);
      }
    }
  }
  return { success: true, opened };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || typeof msg !== 'object') return false;

  if (msg.type === 'RAKURAKU_PING') {
    sendResponse({ pong: true, version: chrome.runtime.getManifest().version });
    return false;
  }

  if (msg.type === 'POST_JOBS') {
    distributeJobs(msg.data).then(sendResponse).catch(e => sendResponse({ success: false, error: e.message }));
    return true; // async response
  }

  if (msg.type === 'GET_PENDING') {
    chrome.storage.session.get(STORAGE_KEY).then(result => {
      sendResponse(result[STORAGE_KEY] || null);
    });
    return true;
  }

  if (msg.type === 'CLEAR_PENDING') {
    chrome.storage.session.remove(STORAGE_KEY).then(() => sendResponse({ cleared: true }));
    return true;
  }

  return false;
});
