import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'data', 'coupons.json');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const readData = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(path.dirname(dataPath), { recursive: true });
      fs.writeFileSync(dataPath, '[]', 'utf8');
    }
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    console.error('读取数据失败:', error);
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('写入数据失败:', error);
  }
};

app.get('/api/coupons', (req, res) => {
  const coupons = readData();
  res.json(coupons);
});

app.get('/api/coupons/:id', (req, res) => {
  const coupons = readData();
  const coupon = coupons.find((item) => item.id === req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: '未找到该优惠券' });
  }
  res.json(coupon);
});

app.post('/api/coupons', (req, res) => {
  const coupons = readData();
  const newCoupon = {
    id: String(Date.now()),
    title: req.body.title || '',
    code: req.body.code || '',
    expireAt: req.body.expireAt || '',
    link: req.body.link || '',
  };
  coupons.push(newCoupon);
  writeData(coupons);
  res.status(201).json(newCoupon);
});

app.put('/api/coupons/:id', (req, res) => {
  const coupons = readData();
  const index = coupons.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '未找到该优惠券' });
  }
  const updated = {
    ...coupons[index],
    title: req.body.title ?? coupons[index].title,
    code: req.body.code ?? coupons[index].code,
    expireAt: req.body.expireAt ?? coupons[index].expireAt,
    link: req.body.link ?? coupons[index].link,
  };
  coupons[index] = updated;
  writeData(coupons);
  res.json(updated);
});

app.delete('/api/coupons/:id', (req, res) => {
  const coupons = readData();
  const index = coupons.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '未找到该优惠券' });
  }
  coupons.splice(index, 1);
  writeData(coupons);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`优惠券服务已启动: http://localhost:${port}`);
});
