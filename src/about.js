import { friendLinks } from './data.js';

const el = document.getElementById('about-friend-links');
if (el) {
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  el.innerHTML = friendLinks.map((f) => {
    let url = f.url;
    if (isWeChat && /^https?:\/\//.test(url)) {
      url = './open.html?url=' + encodeURIComponent(url);
    }
    const desc = f.description ? ` title="${f.description.replace(/"/g, '&quot;')}"` : '';
    return `<a href="${url}" target="_blank" rel="noopener sponsored" class="friend-link"${desc}>${f.name}</a>`;
  }).join('');
}
