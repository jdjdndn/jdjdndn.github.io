// CSS 已通过 <link> 标签在 HTML <head> 中同步加载

// ========== 会员优惠页面逻辑 ==========

// QR Modal 按需加载
let _qrModalPromise = null;
const loadQrModal = () => {
  if (!_qrModalPromise) _qrModalPromise = import('./common/qr-modal.js');
  return _qrModalPromise;
};

// 事件委托：处理 .btn-qr 点击
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-qr');
  if (!btn) return;
  const url = btn.dataset.qrUrl;
  const name = btn.dataset.qrName;
  if (url && name) {
    loadQrModal().then(m => m.showQrModal(url, name, (u) =>
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(u)}`
    ));
  }
});
