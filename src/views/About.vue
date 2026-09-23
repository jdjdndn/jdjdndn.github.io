<template>
  <div class="app-wrapper">
    <SiteNav position="side" />
    <div id="app">
      <PageHero
        icon='<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
        title="关于我们"
        subtitle="券宝平台介绍"
        aria="关于我们"
      />

      <n-card title="平台介绍" :bordered="false">
        <n-space vertical :size="16">
          <n-text>
            券宝是一个一站式优惠券导航站，收录全网热门优惠活动，覆盖美团外卖、淘宝闪购、京东、拼多多、携程/同程/飞猪酒店旅行、滴滴出行、连锁餐饮、电影票、快递寄件等场景。
          </n-text>
          <n-text>
            我们致力于为用户提供最全面、最及时的优惠信息，帮助用户省钱省心。复制口令码或点击链接即可跳转领取，每天更新。
          </n-text>
        </n-space>
      </n-card>

      <n-card title="联系我们" :bordered="false">
        <n-form ref="formRef" :model="formData" :rules="rules">
          <n-form-item label="您的邮箱" path="email">
            <n-input v-model:value="formData.email" placeholder="请输入您的邮箱" />
          </n-form-item>
          <n-form-item label="问题类型" path="type">
            <n-select v-model:value="formData.type" :options="typeOptions" placeholder="请选择问题类型" />
          </n-form-item>
          <n-form-item label="问题描述" path="message">
            <n-input
              v-model:value="formData.message"
              type="textarea"
              placeholder="请详细描述您的问题"
              :rows="4"
            />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit">
              提交反馈
            </n-button>
          </n-form-item>
        </n-form>
      </n-card>

      <n-card :bordered="false">
        <template #header>
          <div class="faq-header">
            <span>常见问题</span>
          </div>
        </template>
        <n-collapse>
          <n-collapse-item title="券宝是什么？" name="1">
            券宝是一个一站式优惠券导航站，收录全网热门优惠活动，覆盖美团外卖、淘宝闪购、京东、拼多多等主流平台。
          </n-collapse-item>
          <n-collapse-item title="如何使用优惠口令码？" name="2">
            两步即可领取：1) 在本站点击复制口令按钮复制口令码；2) 打开对应App（美团/淘宝/京东等），口令自动识别并跳转到领取页面。
          </n-collapse-item>
          <n-collapse-item title="本站收录了哪些平台的优惠？" name="3">
            本站收录了美团外卖、淘宝闪购、京东、拼多多、携程旅行、同程旅行、飞猪出行、滴滴出行等主流平台的优惠活动，以及肯德基、瑞幸咖啡、星巴克等连锁餐饮品牌的优惠券。
          </n-collapse-item>
          <n-collapse-item title="优惠信息多久更新一次？" name="4">
            我们每天都会更新优惠信息，确保用户获取到最新的优惠活动。部分热门活动会实时更新。
          </n-collapse-item>
        </n-collapse>
      </n-card>

      <LegalLinks />
    </div>
    <SiteNav position="footer" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import SiteNav from '../components/SiteNav.vue'
import PageHero from '../components/PageHero.vue'
import LegalLinks from '../components/LegalLinks.vue'

const message = useMessage()
const formRef = ref(null)

const formData = ref({
  email: '',
  type: null,
  message: ''
})

const rules = {
  email: { required: true, message: '请输入邮箱', trigger: 'blur' },
  type: { required: true, message: '请选择问题类型', trigger: 'change' },
  message: { required: true, message: '请输入问题描述', trigger: 'blur' }
}

const typeOptions = [
  { label: '优惠信息错误', value: 'error' },
  { label: '功能建议', value: 'suggestion' },
  { label: '合作咨询', value: 'cooperation' },
  { label: '其他问题', value: 'other' }
]

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    message.success('反馈提交成功，我们会尽快处理！')
    formData.value = { email: '', type: null, message: '' }
  } catch (errors) {
    message.error('请填写完整信息')
  }
}
</script>

<style scoped>
.app-wrapper {
  display: flex;
  min-height: 100vh;
}

#app {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.faq-header {
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
