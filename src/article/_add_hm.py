# -*- coding: utf-8 -*-
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
p = r"E:\code\github.io\src\article\index.html"
with open(p, encoding='utf-8') as f:
    c = f.read()
anchor = '<li class="article-item"><a href="./dingci-card.html"><h3>联通定瓷卡套餐详情</h3><p>定瓷卡39元月租享200G流量+200分钟，可发全国，18-30周岁办理</p></a></li>'
if 'huanma-card.html' in c:
    print("已存在 huanma-card，跳过")
elif c.count(anchor) == 1:
    new_item = anchor + '\n          <li class="article-item"><a href="./huanma-card.html"><h3>广电欢马卡套餐详情</h3><p>欢马卡29元月租享192G通用流量，首月免费，18-65周岁全国可发</p></a></li>'
    c = c.replace(anchor, new_item, 1)
    with open(p, 'w', encoding='utf-8', newline='') as f:
        f.write(c)
    print("已插入欢马卡条目")
else:
    print("锚点异常，数量:", c.count(anchor))
