// CSS 已通过 <link> 标签在 HTML <head> 中同步加载

// ========== 会员优惠页面逻辑 ==========

// QR Modal 按需加载
let _qrModalPromise = null;
const loadQrModal = () => {
  if (!_qrModalPromise) _qrModalPromise = import('./common/qr-modal.js');
  return _qrModalPromise;
};

// 显示二维码
window.showQR = function (url, name) {
  loadQrModal().then(m => m.showQrModal(url, name, (u) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(u)}`
  ));
}

