const apiBase = '/api/coupons';

const searchInput = document.querySelector('#search-input');
const addBtn = document.querySelector('#add-btn');
const modalOverlay = document.querySelector('#modal-overlay');
const modalTitle = document.querySelector('#modal-title');
const form = document.querySelector('#coupon-form');
const idInput = document.querySelector('#coupon-id');
const titleInput = document.querySelector('#title');
const codeInput = document.querySelector('#code');
const expireAtInput = document.querySelector('#expireAt');
const linkInput = document.querySelector('#link');
const cancelBtn = document.querySelector('#cancel-btn');
const tableSection = document.querySelector('#table-section');
const countText = document.querySelector('#count-text');

// --- 数据层 ---

const readLocal = () => JSON.parse(localStorage.getItem('coupons') || '[]');
const writeLocal = (list) => localStorage.setItem('coupons', JSON.stringify(list));

const isApiAvailable = async () => {
  try {
    const res = await fetch(apiBase, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
};

const fetchCoupons = async () => {
  if (await isApiAvailable()) {
    const res = await fetch(apiBase);
    return res.json();
  }
  return readLocal();
};

const formatDate = (value) => {
  if (!value) return '未设置';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('zh-CN');
};

const escapeHtml = (str) => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// --- 渲染 ---

let allCoupons = [];

const renderTable = (keyword = '') => {
  const kw = keyword.trim().toLowerCase();
  const list = kw
    ? allCoupons.filter(
        (c) =>
          c.title.toLowerCase().includes(kw) ||
          c.code.toLowerCase().includes(kw),
      )
    : allCoupons;

  countText.textContent = `共 ${list.length} 条` + (kw ? `（筛选自 ${allCoupons.length} 条）` : '');

  if (!list.length) {
    tableSection.innerHTML = `<div class="empty-msg">${kw ? '没有匹配的优惠券' : '暂无优惠券，点击「新增优惠券」添加'}</div>`;
    return;
  }

  tableSection.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>#</th>
          <th>标题</th>
          <th>优惠码</th>
          <th>有效期</th>
          <th>链接</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        ${list
          .map(
            (c, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(c.title)}</td>
            <td><span class="code-cell">${escapeHtml(c.code)}</span></td>
            <td>${formatDate(c.expireAt)}</td>
            <td class="link-cell"><a href="${escapeHtml(c.link)}" target="_blank" rel="noopener">${escapeHtml(c.link)}</a></td>
            <td class="actions-cell">
              <button class="secondary" data-action="edit" data-id="${c.id}">编辑</button>
              <button class="secondary" data-action="delete" data-id="${c.id}">删除</button>
              <button class="primary" data-action="open" data-link="${escapeHtml(c.link)}">访问</button>
            </td>
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  `;
};

const refresh = async () => {
  allCoupons = await fetchCoupons();
  renderTable(searchInput.value);
};

// --- 模态框 ---

const openModal = (title = '新增优惠券') => {
  modalTitle.textContent = title;
  modalOverlay.classList.remove('hidden');
  titleInput.focus();
};

const closeModal = () => {
  form.reset();
  idInput.value = '';
  modalOverlay.classList.add('hidden');
};

const openCreate = () => {
  openModal('新增优惠券');
};

const openEdit = (id) => {
  const coupon = allCoupons.find((c) => c.id === id);
  if (!coupon) return;
  modalTitle.textContent = '编辑优惠券';
  idInput.value = coupon.id;
  titleInput.value = coupon.title;
  codeInput.value = coupon.code;
  expireAtInput.value = coupon.expireAt;
  linkInput.value = coupon.link;
  openModal('编辑优惠券');
};

// --- 增删改 ---

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    code: codeInput.value.trim(),
    expireAt: expireAtInput.value,
    link: linkInput.value.trim(),
  };

  const editingId = idInput.value;

  if (await isApiAvailable()) {
    if (editingId) {
      await fetch(`${apiBase}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
  } else {
    const list = readLocal();
    if (editingId) {
      const next = list.map((item) => (item.id === editingId ? { ...item, ...payload } : item));
      writeLocal(next);
    } else {
      list.push({ id: String(Date.now()), ...payload });
      writeLocal(list);
    }
  }

  closeModal();
  await refresh();
};

const deleteCoupon = async (id) => {
  const coupon = allCoupons.find((c) => c.id === id);
  const ok = window.confirm(`确认删除「${coupon ? coupon.title : ''}」吗？`);
  if (!ok) return;

  if (await isApiAvailable()) {
    await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
  } else {
    const next = readLocal().filter((item) => item.id !== id);
    writeLocal(next);
  }

  await refresh();
};

// --- 事件绑定 ---

addBtn.addEventListener('click', openCreate);
cancelBtn.addEventListener('click', closeModal);
form.addEventListener('submit', handleSubmit);

// 点击遮罩关闭模态框
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ESC 关闭模态框
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
    closeModal();
  }
});

// 搜索防抖
let searchTimer = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => renderTable(searchInput.value), 200);
});

// 表格按钮事件委托
tableSection.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const { action, id, link } = btn.dataset;
  if (action === 'edit') openEdit(id);
  else if (action === 'delete') deleteCoupon(id);
  else if (action === 'open' && link) window.open(link, '_blank', 'noopener');
});

// --- 初始化 ---
refresh();
