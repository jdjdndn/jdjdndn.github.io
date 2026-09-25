// ========== 卡片渲染 ==========

import { isExpired, isExpiringSoon, isNewActivity, isHotActivity, formatCountdown, highlightText, getIconForName } from './utils.js';
import { isWechatLink, getWeixinOnclick } from '../utils/linkHandler.js';

// 外部传入的 hideExpired 状态（由 app.js 管理）
let _hideExpired = false;
export const setHideExpired = (v) => { _hideExpired = v; };
export const getHideExpired = () => _hideExpired;

export const renderCodeCard = (item, query) => {
  const isMiniApp = isWechatLink(item.code);
  const expired = isExpired(item.deadline);
  if (_hideExpired && expired) return '';
  const expiringSoon = isExpiringSoon(item.deadline);
  const expiredClass = expired ? ' expired' : '';
  const expiringClass = expiringSoon ? ' expiring-soon' : '';
  const displayName = query ? highlightText(item.name, query) : item.name;
  const displayCode = query ? highlightText(item.code, query) : item.code;

  let badges = '';
  if (!expired) {
    const badgeList = [];
    if (isNewActivity(item)) badgeList.push('<span class="card-badge badge-new">🆕 新</span>');
    if (isHotActivity(item)) badgeList.push('<span class="card-badge badge-hot">🔥 热门</span>');
    if (expiringSoon) badgeList.push('<span class="card-badge badge-expiring">⏰ 即将过期</span>');
    badges = badgeList.join('');
  }

  const deadlineDisplay = item.deadline
    ? (expiringSoon ? formatCountdown(item.deadline) : `<span class="card-deadline">截止 ${item.deadline}</span>`)
    : '';

  const hash = [...(item.name || '')].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 40) % 360;

  const icon = getIconForName(item.name);

  return `
  <div class="activity-card card-code-style${expiredClass}${expiringClass}" role="article" aria-label="${item.name}" style="--card-gradient: linear-gradient(135deg, #FFF4ED 0%, #FFE8DB 100%); --card-accent: #FF6B35;">
    <div class="card-gradient-bar"></div>
    <div class="card-head">
      <span class="card-icon-badge">${icon}</span>
      <span class="card-name"${query ? ' data-highlight' : ''}>${displayName}</span>
      <div class="card-badges">
        ${isMiniApp ? '<span class="miniapp-tag">小程序</span>' : ''}
        ${badges}
      </div>
    </div>
    ${deadlineDisplay ? `<div class="card-deadline-wrapper"${expiringSoon ? ' data-expiring' : ''}>${deadlineDisplay}</div>` : ''}
    <div class="card-code"${query ? ' data-highlight' : ''}>${displayCode}</div>
    <div class="card-actions">
      <button class="btn-copy" data-copy="${item.code.replace(/"/g, '&quot;')}" ${expired ? 'disabled' : ''}>复制口令</button>
      <button class="btn-share" data-share-name="${item.name.replace(/"/g, '&quot;')}" data-share-text="${item.code.replace(/"/g, '&quot;')}">分享</button>
    </div>
  </div>
  `;
};

export const renderLinkCard = (item, query) => {
  const expired = isExpired(item.deadline);
  if (_hideExpired && expired) return '';
  const expiringSoon = isExpiringSoon(item.deadline);
  const expiredClass = expired ? ' expired' : '';
  const expiringClass = expiringSoon ? ' expiring-soon' : '';
  let host = '';
  try { host = new URL(item.link).hostname.replace('www.', ''); } catch { host = item.link; }
  const displayName = query ? highlightText(item.name, query) : item.name;

  let badges = '';
  if (!expired) {
    const badgeList = [];
    if (isNewActivity(item)) badgeList.push('<span class="card-badge badge-new">🆕 新</span>');
    if (isHotActivity(item)) badgeList.push('<span class="card-badge badge-hot">🔥 热门</span>');
    if (expiringSoon) badgeList.push('<span class="card-badge badge-expiring">⏰ 即将过期</span>');
    badges = badgeList.join('');
  }

  const deadlineDisplay = item.deadline
    ? (expiringSoon ? formatCountdown(item.deadline) : `<span class="card-deadline">截止 ${item.deadline}</span>`)
    : '';

  const descHtml = item.description ? `<p class="card-desc">${item.description}</p>` : '';

  const hash = [...(item.name || '')].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 30) % 360;

  const icon = getIconForName(item.name);

  return `
  <div class="activity-card card-link-style${expiredClass}${expiringClass}" role="article" aria-label="${item.name}" style="--card-gradient: linear-gradient(135deg, #FFF4ED 0%, #FFE8DB 100%); --card-accent: #FF6B35;">
    <div class="card-gradient-bar"></div>
    <div class="card-head">
      <span class="card-icon-badge">${icon}</span>
      <span class="card-name"${query ? ' data-highlight' : ''}>${displayName}</span>
      <div class="card-badges">
        ${badges}
      </div>
    </div>
    ${descHtml}
    ${deadlineDisplay ? `<div class="card-deadline-wrapper"${expiringSoon ? ' data-expiring' : ''}>${deadlineDisplay}</div>` : ''}
    <a class="card-link" href="${item.link}" target="_blank" rel="noopener" title="${item.link}"${getWeixinOnclick(item.link)}>${host || '前往活动'}</a>
    <div class="card-actions">
      <a class="btn-go" href="${item.link}" target="_blank" rel="noopener" ${isWechatLink(item.link) ? 'data-weixin="true"' : ''} ${getWeixinOnclick(item.link)} ${expired ? 'tabindex="-1"' : ''}>前往活动</a>
      <button class="btn-qr" data-link="${item.link}" data-name="${item.name.replace(/"/g, '&quot;')}">二维码</button>
      <button class="btn-share" data-share-name="${item.name.replace(/"/g, '&quot;')}" data-share-url="${item.link}">分享</button>
    </div>
  </div>
  `;
};

// ========== 渲染：API 活动卡片 ==========
export const renderApiCard = (item, query) => {
  const hasLink = item.actionType === 'link' && !!item.link;
  const hasMini = item.actionType === 'miniprogram' && !!item.appId;
  const hasTkl = item.actionType === 'tkl' && !!item.tkl;

  const dateInfo = item.startDate && item.endDate
    ? `<span class="api-card-date">📅 ${item.startDate} ~ ${item.endDate}</span>`
    : '';

  const imgHtml = item.img
    ? `<img class="api-card-img" src="${item.img}" alt="${item.name}" loading="lazy" />`
    : '';

  let actionHtml = '';
  if (hasLink) {
    actionHtml = `<a class="btn-go" href="${item.link}" target="_blank" rel="noopener">前往活动</a>`;
  } else if (hasMini) {
    actionHtml = `<span class="api-card-miniapp">小程序</span>`;
  } else if (hasTkl) {
    actionHtml = `<button class="btn-copy" data-tkl="${item.tkl.replace(/"/g, '&quot;')}">复制口令</button>`;
  }

  const displayName = query ? highlightText(item.name, query) : item.name;
  return `
  <div class="activity-card api-card">
    ${imgHtml}
    <div class="api-card-body">
      <div class="card-head">
        <span class="card-name"${query ? ' data-highlight' : ''}>${displayName}</span>
      </div>
      ${dateInfo ? `<div class="api-card-meta">${dateInfo}</div>` : ''}
      <div class="card-actions">
        ${actionHtml}
        ${hasLink ? `<button class="btn-qr" data-link="${item.link}" data-name="${item.name.replace(/"/g, '&quot;')}">二维码</button>` : ''}
        <button class="btn-share" data-share-name="${item.name.replace(/"/g, '&quot;')}" data-share-url="${item.link || ''}">分享</button>
      </div>
    </div>
  </div>`;
};
