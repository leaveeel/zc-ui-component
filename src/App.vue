<script setup lang="ts">
import {reactive, ref} from 'vue'

import zcButton from '@/packages/button/src/index.vue'
import zcButtonGroup from '@/packages/buttonGroup/src/index.vue'
import zcCard from '@/packages/card/src/index.vue'
import zcCheckbox from '@/packages/checkbox/src/index.vue'
import zcCheckboxGroup from '@/packages/checkboxGroup/src/index.vue'
import zcDialog from '@/packages/dialog/src/index.vue'
import zcForm from '@/packages/form/src/index.vue'
import zcFormItem from '@/packages/formItem/src/index.vue'
import zcInput from '@/packages/input/src/index.vue'
import zcIcon from '@/packages/icon/index.vue'
import { loadingDirective, zcLoading, useLoading } from '@/packages/loading/zc-loading.ts'
import { zcMessage } from '@/packages/messageBox/zc-messageBox.ts'
import zcPagination from '@/packages/pagination/src/index.vue'
import zcScroll from '@/packages/scroll/src/index.vue'
import zcTable from '@/packages/table/src/index.vue'
import { zcToast } from '@/packages/toast/zc-toast.ts'
import zcTooltip from '@/packages/tooltip/src/index.vue'
import IconChecked from '@/packages/icon/src/IconChecked.vue'
import IconClose from '@/packages/icon/src/IconClose.vue'
import IconLoading from '@/packages/icon/src/IconLoading.vue'
import { zcUI } from '@/types/zcUI'

const checkbox = ref(false)
const checkboxChange = (e: any) => {
  console.log(e)
}
const checkboxGroup = ref([])

const dialogVisible = ref(false)
const dialogCancel = () => {
  console.log('dialogCancel')
}

const form = ref({
  item1: ''
})
const formdis = ref(false)
const loadingFun = () => {
  const loading = useLoading({
    text: 'Loading...',
    color: '#1890ff',
    timeout: 1000, // 1秒后自动关闭
  })
  loading.show()
}

const openMessage = () =>{
  zcMessage({
    message: 'message',
    beforeClose: (action, instance, done: () => void) => {
      instance.loading = true
      setTimeout(() => {
        done()
      }, 1000);
    }
  })
  .then(()=>{
    zcToast('confirm', {type: 'success'})
  })
  .catch(()=>{
    zcToast('cancel', {type: 'warning'})
  })
}



const page = reactive({
  total: 0,
  size: 10,
  no: 1
})
const pageChange = (p: number) => {
  console.log(p)
}

const change = (e: string) => {
  console.log(e)
}



const tableData = ref<any[]>([])

const tableOption = reactive<any>([
  {
    prop: 'id',
    label: 'ID'
  },
  {
    prop: 'type',
    label: 'Type'
  },
  {
    prop: 'time',
    label: 'Time',
    fixed: 'right',
    width: 500
  },
  {
    label: 'Option',
    fixed: 'right',
    btns: [
      {
        name: 'Details',
        color: 'var(--main-color)',
        handle: (index: number, row: any) => {
          console.log(index, row)
        }
      },
      {
        name: 'Delete',
        color: 'var(--main-danger-color)',
        handle: (index: number, row: any) => {
          console.log(index, row)
        }
      }
    ]
  }
])

setTimeout(() => {
  tableData.value = [
    {
        "id": 47,
        "requestId": "788",
        "fingerprint": "Jg7ZGBti41",
        "userId": 11,
        "operationType": 0,
        "createTime": "2009-02-06 14:14:11"
    },
    {
        "id": 48,
        "requestId": "387",
        "fingerprint": "vQ180O6YV5",
        "userId": 11,
        "operationType": 2,
        "createTime": "2007-02-18 13:34:13"
    },
    {
        "id": 49,
        "requestId": "495",
        "fingerprint": "KyhNtc0rF2",
        "userId": 11,
        "operationType": 1,
        "createTime": "2004-06-11 21:06:16"
    },
    {
        "id": 50,
        "requestId": "918",
        "fingerprint": "7mnOMfin7H",
        "userId": 11,
        "operationType": 1,
        "createTime": "2007-05-03 00:43:06"
    },
    {
        "id": 51,
        "requestId": "529",
        "fingerprint": "XsiJGHnyWe",
        "userId": 11,
        "operationType": 1,
        "createTime": "2007-02-20 10:45:22"
    },
    {
        "id": 52,
        "requestId": "406",
        "fingerprint": "LECMumq20J",
        "userId": 11,
        "operationType": 0,
        "createTime": "2016-07-10 01:46:07"
    },
    {
        "id": 53,
        "requestId": "441",
        "fingerprint": "bxqHFmmd8o",
        "userId": 11,
        "operationType": 1,
        "createTime": "2024-11-30 07:26:58"
    },
    {
        "id": 54,
        "requestId": "991",
        "fingerprint": "rgYevD2NeZ",
        "userId": 11,
        "operationType": 1,
        "createTime": "2024-02-02 18:15:47"
    },
    {
        "id": 55,
        "requestId": "910",
        "fingerprint": "Egw5VnpLex",
        "userId": 11,
        "operationType": 0,
        "createTime": "2022-12-10 16:16:43"
    },
    {
        "id": 56,
        "requestId": "873",
        "fingerprint": "ZORHzjQSHt",
        "userId": 11,
        "operationType": 1,
        "createTime": "2022-08-16 07:59:33"
    }
]
}, 2000);

const ee = () => {
  console.log(2)
}

const inputRef = ref<any>()
const dd = () => {
  inputRef.value.$refs.textareaRef.focus()
}
</script>

<template>
  <div class="demo">
    <div>
      <zc-button  style="margin-bottom: 10px;">button</zc-button>
      <zc-button inline>button</zc-button>
      <zc-button inline>button</zc-button>
    </div>
    <div>
      <zc-button-group gap="40">
        <zc-button disabled>button</zc-button>
        <zc-button loading plain>button</zc-button>
        <zc-button text>button</zc-button>
      </zc-button-group>
    </div>
    <div>
      <zc-card height="50" background="#ddd">card</zc-card>
    </div>
    <div>
      <zc-checkbox v-model="checkbox" label="checkbox" @change="checkboxChange"></zc-checkbox>
    </div>
    <div>
      <zc-checkbox-group v-model="checkboxGroup" @change="checkboxChange">
        <zc-checkbox label="checkbox1" :value="0" ></zc-checkbox>
        <zc-checkbox label="checkbox2" :value="2" ></zc-checkbox>
        <zc-checkbox label="1"></zc-checkbox>
      </zc-checkbox-group>
    </div>
    <div>
      <zc-button @click="dialogVisible = true">open dialog</zc-button>
      <zc-dialog
        @cancel="dialogCancel"
        :close-icon="true"
        v-model="dialogVisible"
      >
        <template #header>title</template>
        <template #default>dialog</template>
        <template #footer>footer</template>
      </zc-dialog>
    </div>
    <div>
      <zc-form :model="form" :disabled="formdis">
        <zc-form-item label="formitem1" prop="item1">
          <zc-input v-model="form.item1" :maxLength="10" clearable @change="change"></zc-input>
          <zc-button @click="formdis=true">set</zc-button>
        </zc-form-item>
        {{ form.item1 }}
      </zc-form>
    </div>
    <div>
      <zc-button @click="loadingFun">open loading</zc-button>
    </div>
    <div>
      <zc-icon :size="30">
        <icon-close></icon-close>
      </zc-icon>
      <zc-icon :size="40">
        <icon-close></icon-close>
      </zc-icon>
      <zc-icon :size="50">
        <icon-close></icon-close>
      </zc-icon>
    </div>
    <div>
      <zc-button @click="openMessage">open message</zc-button>
    </div>
    <div style="width: 1000px; height: 300px;">
      <zc-table border :data="tableData" :option="tableOption" :key="tableData.length"></zc-table>
    </div>
    <div>
      <zc-pagination layout="sizes, prev, pager, next, jumper, total" v-model="page.no" :total="page.total" :page-size="page.size" @change="pageChange" showTotal></zc-pagination>
    </div>
    <div style="padding: 30px;height: 500px;box-sizing: border-box;">
      <zc-scroll width="500" height="max-content">
        <div style="background: #0f0;width: 1100px;height:500px;">
        scroll
        </div>
      </zc-scroll>
    </div>
    <div style="width:200px;">
      <zc-tooltip position="top" content="click" trigger="click"><div style="background-color: #0f0;">click tooltip</div></zc-tooltip>
      <zc-tooltip position="right" content="hover"><div style="background-color: #ff0;">hover tooltip</div></zc-tooltip>
    </div>
    <div>
      <zc-button @click="zcToast('show toast', {type: 'success',duration: 0})">show toast</zc-button>
    </div>

    <div style="width: 200px;height: 500px;position: relative;">
      <zc-input ref="inputRef" type="textarea" v-model="form.item1" height="100%" resize></zc-input>
      
      <div @click="dd" style="position: absolute;top: 0;left: 0;">11111111
        <zc-button @click.stop="ee">button</zc-button>
      </div>
    </div>



    <div
    style="
  display: grid;
  gap: 20px;
  grid-template-columns: 500px 380px;
  grid-template-rows: 500px;
  "
    >
      <zc-card 
      maxHeight="1100"
      >
        <div style="height: 100%;
      display: flex;
      flex-direction: column;">
          <div style="padding: 100px;background: #0f0;"></div>
          <zc-scroll style="flex: 1;">
            <div style="background: #f00;width: 1100px;height: 1100px;"></div>
          </zc-scroll>
        </div>

      </zc-card>
    </div>

    <div
    style="
  display: grid;
  gap: 20px;
  grid-template-columns: 500px 380px;
  grid-template-rows: 500px;
  "
    >
      <zc-card 
      maxHeight="1100"
      >
        <div style="height: 100%;
      display: flex;
      flex-direction: column;">
          <div style="padding: 100px;background: #0f0;"></div>
          <div style="flex:1;word-break: break-all;overflow: hidden;">
            <div style="height: 1000px"></div>
          </div>
        </div>

      </zc-card>
    </div>

  </div>
</template>

<style scoped>
.demo > div {
  margin-bottom: 10px;
}
</style>
