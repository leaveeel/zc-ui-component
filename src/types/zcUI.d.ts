import { RuleItem } from "async-validator"

export namespace zcUIProps {
  /**
   * Button 组件属性
   * @property {boolean} plain - 是否为朴素按钮（仅显示边框）
   * @property {boolean} text - 是否为文本按钮（无边框和背景）
   * @property {boolean} inline - 是否为行内按钮
   * @property {string|number} width - 按钮宽度
   * @property {string|number} height - 按钮高度
   * @property {string|number} size - 按钮尺寸
   * @property {string|number} radius - 按钮圆角大小
   * @property {string} color - 按钮文字颜色
   * @property {string} background - 按钮背景颜色
   * @property {string} borderColor - 按钮边框颜色
   * @property {string|number} border - 按钮边框宽度
   * @property {boolean} loading - 是否显示加载状态
   * @property {boolean} disabled - 是否禁用按钮
   * @property {string} type - 按钮类型：默认、主要、成功、警告、危险、信息
   * @property {string} htmlType - 原生button类型：button、submit、reset
   * @property {boolean} disabled - 是否禁用按钮
   */
  export interface Button {
    plain?: boolean
    text?: boolean
    inline?: boolean,
    width?: string | number
    height?: string | number
    fontSize?: string | number
    radius?: string | number
    color?: string
    background?: string
    loading?: boolean
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    htmlType?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }

  /**
   * Skeleton 组件属性
   * @property {boolean} loading - 是否显示骨架屏
   * @property {boolean} animated - 是否启用动画效果
   * @property {string} backgroundColor - 骨架屏背景色
   * @property {string} highlightColor - 动画高亮颜色
   * @property {boolean} round - 是否显示为圆角
   * @property {string|number} radius - 圆角大小
   * @property {number} rows - 默认段落行数
   * @property {boolean} title - 是否显示默认标题
   */
  export interface Skeleton {
    loading?: boolean
    animated?: boolean
    backgroundColor?: string
    highlightColor?: string
    round?: boolean
    radius?: string | number
    rows?: number
    title?: boolean
  }
  
  /**
   * SkeletonItem 组件属性
   * @property {string} variant - 骨架屏元素类型：文本、标题、图片、圆形
   * @property {string|number} width - 宽度
   * @property {string|number} height - 高度
   * @property {string|number} radius - 圆角大小
   */
  export interface SkeletonItem {
    variant?: 'text' | 'title' | 'image' | 'circle'
    width?: string | number
    height?: string | number
    radius?: string | number
  }

  /**
   * Card 组件属性
   * @property {string|number} height - 卡片高度
   * @property {string|number} maxHeight - 卡片最大高度
   * @property {string|number} radius - 卡片圆角
   * @property {string} background - 卡片背景色
   * @property {boolean} loading - 是否显示加载状态
   * @property {string|number} padding - 卡片内边距
   * @property {boolean} bordered - 是否显示边框
   * @property {string} borderColor - 边框颜色
   * @property {string|number} borderWidth - 边框宽度
   * @property {string} shadow - 阴影效果：none, light, medium, heavy
   * @property {string} width - 卡片宽度
   * @property {boolean} hoverable - 是否在悬停时显示阴影效果
   */
  export interface Card {
    height?: string | number
    maxHeight?: string | number
    radius?: string | number
    background?: string
    loading?: boolean
    padding?: string | number
    bordered?: boolean
    borderColor?: string
    borderWidth?: string | number
    shadow?: 'none' | 'light' | 'medium' | 'heavy'
    width?: string | number
    hoverable?: boolean
  }

  /**
   * Checkbox 组件属性
   * @property {boolean | string | number} modelValue - 复选框绑定值
   * @property {string} label - 复选框标签文本
   * @property {string|number} value - 复选框值，用于在复选框组中使用
   * @property {boolean | undefined} disabled - 是否禁用复选框
   * @property {boolean} indeterminate - 是否半选
   */
  export interface Checkbox {
    modelValue?: boolean | string | number
    label?: string
    value?: string | number
    disabled?: boolean | undefined
    indeterminate?: boolean
  }

    /**
   * Radio 组件属性
   * @property {boolean} modelValue - 单选框绑定值
   * @property {string} label - 单选框标签文本
   * @property {string|number} value - 单选框值，用于在单选框组中使用
   * @property {boolean | undefined} disabled - 是否禁用单选框
   */
    export interface Radio {
      modelValue?: boolean | string | number
      label: string
      value?: boolean | string | number
      disabled?: boolean | undefined
    }

  /**
   * Dialog 组件属性
   * @property {boolean} modelValue - 对话框是否可见
   * @property {string|number} padding - 对话框内边距
   * @property {boolean} closeOnClickModal - 点击遮罩层是否关闭对话框
   * @property {boolean} closeIcon - 是否显示关闭图标
   * @property {string|number} width - 对话框宽度
   * @property {string|number} minWidth - 对话框最小宽度
   * @property {boolean} loading - 是否显示加载状态
   * @property {boolean} closeOnPressEscape - 是否在按下 Escape 键时关闭对话框
   * @property {string} title - 对话框标题
   */
  export interface Dialog {
    modelValue: boolean
    padding?: string | number
    closeOnClickModal?: boolean
    closeIcon?: boolean
    width?: string | number
    minWidth?: string | number
    loading?: boolean
    closeOnPressEscape?: boolean
    title?: string
  }

  /**
   * Form 组件属性
   * @property {Record<string, RuleItem|RuleItem[]>} rules - 表单验证规则
   * @property {Record<string, any>} model - 表单数据对象
   * @property {string} labelPosition - 表单标签位置：左对齐、右对齐、顶部对齐
   * @property {string} labelAlign - 标签文字对齐方式：左对齐、右对齐
   * @property {string|number} labelWidth - 表单标签宽度
   * @property {boolean} scrollToError - 提交表单且校验不通过时，是否滚动到错误的表单项
   * @property {boolean} hideRequiredAsterisk - 是否隐藏必填字段的标签旁边的红色星号
   * @property {boolean} validateOnRuleChange - 是否在rules属性改变后立即触发一次验证
   * @property {boolean} disabled - 是否禁用该表单内的所有组件
   * @property {boolean} enterSubmit - 是否在按下Enter键时提交表单
   * @property {boolean} inline - 是否为行内表单
   */
  export interface Form {
    rules?: Record<string, (RuleItem & { trigger: 'change' | 'blur' }) | (RuleItem & { trigger: 'change' | 'blur' })[]>
    model: Record<string, any>
    labelPosition?: 'left' | 'right' | 'top'
    labelAlign?: 'left' | 'right'
    labelWidth?: string | number
    scrollToError?: boolean
    hideRequiredAsterisk?: boolean
    validateOnRuleChange?: boolean
    disabled?: boolean
    enterSubmit?: boolean
    inline?: boolean
  }

  /**
   * FormItem 组件属性
   * @property {string} label - 表单项标签
   * @property {string} prop - 表单项属性，对应form model中的字段
   * @property {RuleItem|RuleItem[]} rules - 表单项验证规则
   * @property {boolean} required - 是否必填
   * @property {string|number} labelWidth - 表单项标签宽度
   * @property {string} labelPosition - 表单项标签位置：左对齐、右对齐、顶部对齐
   * @property {string} labelAlign - 标签文字对齐方式：左对齐、右对齐
   * @property {boolean} error - 表单域验证错误信息
   * @property {boolean} showMessage - 是否显示校验错误信息
   * @property {boolean | undefined} disabled - 是否禁用
   */
  export interface FormItem {
    label?: string
    prop?: string
    rules?: (RuleItem & { trigger: 'change' | 'blur' }) | (RuleItem & { trigger: 'change' | 'blur' })[]
    required?: boolean
    labelWidth?: string | number
    labelPosition?: 'left' | 'right' | 'top'
    labelAlign?: 'left' | 'right'
    error?: string
    showMessage?: boolean
    disabled?: boolean | undefined
  }

  /**
   * Input 组件属性
   * @property {string} tip - 输入框提示信息
   * @property {string} modelValue - 输入框绑定值
   * @property {string} autocomplete - 自动完成属性
   * @property {string} type - 输入框类型
   * @property {boolean} clearable - 是否可清空
   * @property {boolean} showPassword - 是否显示密码切换按钮
   * @property {boolean} disabled - 是否禁用
   * @property {string} placeholder - 输入框占位文本
   * @property {number} maxLength - 最大输入长度
   * @property {boolean} resize - 文本域是否可调整大小
   * @property {number} min - 最小值
   * @property {number} max - 最大值
   */
  export interface Input {
    tip?: string
    modelValue: string | number
    height?: string | number
    autocomplete?: string
    type?: 'text' | 'password' | 'textarea' | 'number' | 'email' | 'tel' | 'url'
    clearable?: boolean
    showPassword?: boolean
    disabled?: boolean
    placeholder?: string
    maxlength?: number
    resize?: boolean
    min?: number
    max?: number
  }

  /**
   * Pagination 组件属性
   * @property {number} total - 总条目数
   * @property {number} pageSize - 每页显示条目个数
   * @property {number} modelValue - 当前页码
   * @property {string} layout - 分页组件布局，可选值: 'sizes', 'prev', 'pager', 'next', 'jumper', 'total'
   * @property {number[]} pageSizes - 每页显示条目数的选项列表
   * @property {boolean} hideOnSinglePage - 只有一页时是否隐藏分页
   * @property {string} lang - 语言，可选值: 'en', 'zh'
   */
  export interface Pagination {
    total: number
    pageSize: number
    modelValue: number
    layout?: string
    pageSizes?: number[]
    hideOnSinglePage?: boolean
    lang?: 'en' | 'zh'
  }

  /**
   * Scroll 组件属性
   * @property {number|string} width - 滚动区域宽度
   * @property {number|string} height - 滚动区域高度
   * @property {number|string} maxWidth - 滚动区域最大宽度
   * @property {number|string} maxHeight - 滚动区域最大高度
   */
  export interface Scroll {
    width?: string | number;
    height?: string | number;
    maxWidth?: string | number;
    maxHeight?: string | number;
  }

  /**
   * Table 组件属性
   * @property {Record<string, any>[]} data - 表格数据
   * @property {zcUI.TableOptions[]} option - 表格列配置选项
   * @property {boolean} border - 是否显示边框
   * @property {number|string} height - 表格高度
   * @property {boolean} loading - 是否显示加载状态
   * @property {boolean} stripe - 是否显示斑马纹
   * @property {boolean} showHeader - 是否显示表头
   * @property {string} rowKey - 行数据的键值，用于标识每一行
   * @property {string} emptyText - 空数据时显示的文本
   * @property {object} defaultSort - 默认排序方式
   * @property {object} treeProps - 树形表格配置
   * @property {boolean} defaultExpandAll - 是否默认展开所有节点
   * @property {boolean} checkStrictly - 是否严格的遵循父子不互相关联
   * @property {Function} rowClassName - 行的 className 的回调方法
   * @property {Function} cellClassName - 单元格的 className 的回调方法
   * @property {Function} headerRowClassName - 表头行的 className 的回调方法
   * @property {Function} headerCellClassName - 表头单元格的 className 的回调方法
   */
  export interface Table {
    data: Record<string, any>[]
    option?: zcUI.TableOptions[]
    border?: boolean
    height?: number | string
    maxHeight?: number | string
    loading?: boolean
    stripe?: boolean
    showHeader?: boolean
    rowKey?: string
    emptyText?: string
    defaultSort?: { prop: string, order: string }
    treeProps?: { label: string, children: string }
    defaultExpandAll?: boolean
    checkStrictly?: boolean
    defaultChecked?: (number | string)[]
    rowClassName?: (row: any, rowIndex: number) => string
    cellClassName?: (row: any, column: any, rowIndex: number, columnIndex: number) => string
    headerRowClassName?: () => string
    headerCellClassName?: (column: any, columnIndex: number) => string
  }

  export interface TableRow {
    row: any
    rowIndex: number
    option: zcUI.TableOptions[]
    rowKey: string,
    colWidths: number[]
  }

  /**
   * Toast 组件属性
   * @property {string} type - 提示类型：成功、错误、警告、普通
   * @property {string} color - 提示文本颜色
   * @property {string} message - 提示文本内容
   * @property {number} duration - 显示时间，单位毫秒
   */
  export interface Toast {
    type?: 'success' | 'error' | 'warning' | 'normal'
    color?: string
    message?: string
    duration?: number
  }


  /**
   * Loading 组件属性
   * @property {number|string} size - 加载图标大小
   * @property {string} color - 加载图标颜色
   * @property {string} text - 加载文本
   * @property {number} timeout - 加载持续时间
   * @property {string} background - 加载背景颜色
   * @property {boolean} fullscreen - 是否全屏显示
   * @property {number|string} fontSize - 加载文本字体大小
   * @property {boolean} loading - 是否显示加载状态
   * @property {[property: string]: any} [property: string]: any - 允许使用字符串索引
   */
  export interface Loading {
    size?: number | string
    color?: string
    text?: string
    timeout?: number
    background?: string
    fullscreen?: boolean
    fontSize?: number | string
    loading?: boolean
    [property: string]: any
  }
  
  /**
   * MessageBox 组件属性
   * @property {string} title - 消息框标题
   * @property {string} message - 消息框内容
   * @property {boolean} showConfirm - 是否显示确认按钮
   * @property {string} confirmText - 确认按钮文本
   * @property {string} confirmClass - 确认按钮样式类
   * @property {boolean} showCancel - 是否显示取消按钮
   * @property {string} cancelText - 取消按钮文本
   * @property {string} cancelClass - 取消按钮样式类
   * @property {Function} beforeClose - 关闭前的回调函数
   * @property {Function} callback - 关闭后的回调函数
   * @property {boolean} loading - 是否显示加载状态
   * @property {zcUI.Input} input - 输入框属性
   */
  export interface MessageBox {
    title?: string,
    message: string,
    showConfirm?: boolean,
    confirmText?: string,
    confirmClass?: string,
    showCancel?: boolean,
    cancelText?: string,
    cancelClass?: string,
    beforeClose?: (action: string, instance: any, done: () => void) => void,
    callback?: (state: Record<string, any>) => void
    loading?: boolean,
    input?: Input
  }

  /**
   * Tooltip 组件属性
   * @property {string|number} maxWidth - 最大宽度
   * @property {string|number} maxHeight - 最大高度
   * @property {string} content - 文字内容，如果使用slot="content"则此prop可忽略
   * @property {Placement} placement - 提示框位置
   * @property {'light' | 'dark'} theme - 主题：亮色、暗色
   * @property {'hover' | 'click'} trigger - 触发方式：悬停、点击
   * @property {number} offset - 间距
   * @property {boolean} showArrow - 是否显示箭头
   * @property {boolean} disabled - 是否禁用
   */
  export interface Tooltip {
    maxWidth?: string | number
    maxHeight?: string | number
    content: string
    placement?: Placement
    theme?: 'light' | 'dark'
    trigger?: 'hover' | 'click'
    offset?: number
    showArrow?: boolean
    disabled?: boolean
  }


  /**
   * Image 组件属性
   * @property {string} src - 图片源地址
   * @property {string|number} width - 图片宽度
   * @property {string|number} height - 图片高度
   * @property {string} objectFit - 图片适应方式
   * @property {string} alt - 图片描述
   * @property {boolean} lazy - 是否懒加载
   * @property {number} threshold - 加载阈值
   */
  export interface Image {
    src?: string
    width?: string | number
    height?: string | number
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    alt?: string
    lazy?: boolean
    threshold?: number
  }

  /**
     * Icon 图标组件属性
     * @property {string|number} size - 图标大小
     * @property {string} color - 图标颜色
     * @property {boolean} spin - 是否旋转
     * @property {number} rotate - 旋转角度
     * @property {boolean} disabled - 是否禁用
     */
  export interface Icon {
    size?: string | number
    color?: string
    spin?: boolean
    rotate?: number
    disabled?: boolean
  }

  /**
   * Switch 组件属性
   * @property {string | number | boolean} modelValue - 开关绑定值
   * @property {boolean} disabled - 是否禁用
   * @property {() => Promise<boolean> | boolean} beforeChange - 切换前执行的函数，返回 false 或 Promise.reject 则阻止切换
   * @property {string | number | boolean} activeValue - 打开时的值
   * @property {string | number | boolean} inactiveValue - 关闭时的值
   */
  export interface Switch {
    modelValue: string | number | boolean
    disabled?: boolean
    beforeChange?: () => Promise<boolean> | boolean
    activeValue?: string | number | boolean
    inactiveValue?: string | number | boolean
  }

  /**
   * Datepicker 组件属性
   * @property {string | string[] | Date | Date[]} modelValue - 开关绑定值
   * @property {'date' | 'daterange' | 'datetime'} type - 类型
   * @property {string} placeholder - 占位文本
   * @property {boolean} clearable - 是否显示清空按钮
   * @property {boolean} disabled - 是否禁用
   * @property {string} format - 显示格式
   * @property {string} valueFormat - 值格式
   */
  export interface DatePicker {
    modelValue: string | string[] | Date | Date[]
    type?: 'date' | 'daterange' | 'datetime'
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
    format?: string
    valueFormat?: string
  }

  /**
   * Tree 组件
   * @property {zcUI.TreeNode[]} data - 树组件数据
   * @property {boolean} defaultExpandAll - 是否默认展开所有节点
   * @property {boolean} checkable - 节点是否可选择
   * @property {boolean} selectable - 节点是否可点击选中
   * @property {boolean} accordion - 是否每次只打开一个同级树节点
   * @property {boolean} checkStrictly - 是否严格的遵循父子不互相关联
   * @property {(string | number)[]} defaultCheckedKeys - 默认勾选的节点
   * @property { label: string, children: string } props - 配置选项，如 { label: 'name', children: 'child' }
   * @property {(value: string, data: zcUI.TreeNode) => boolean} filterNodeMethod - 对树节点进行筛选时执行的方法
   * @property {string} nodeKey - 每个树节点用来作为唯一标识的属性
   * @property {boolean} expandOnClickNode - 是否在点击节点的时候展开或者收缩节点
   * 
   */
  export interface Tree {
    data: zcUI.TreeNode[]
    defaultExpandAll?: boolean
    checkable?: boolean
    selectable?: boolean
    accordion?: boolean
    checkStrictly?: boolean
    defaultCheckedKeys?: (string | number)[]
    props?: { label: string, children: string }
    filterNodeMethod?: (value: string, data: zcUI.TreeNode) => boolean
    nodeKey?: string
    expandOnClickNode?: boolean
  }

  /**
   * Select 组件属性
   * @property {string | number | (string | number)[]} modelValue - 选择器绑定值
   * @property {zcUIProps.SelectOption[]} options - 选项数据
   * @property {string} placeholder - 占位文本
   * @property {boolean} clearable - 是否可清空
   * @property {boolean} disabled - 是否禁用
   * @property {boolean} filterable - 是否可搜索
   * @property {boolean} multiple - 是否多选
   * @property {boolean} collapseTags - 多选时是否折叠标签
   * @property {number} maxCollapseTags - 折叠标签时最多显示的标签数量
   */
  export interface Select {
    modelValue: undefined | string | number | (string | number)[]
    options?: zcUIProps.SelectOption[]
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
    filterable?: boolean
    multiple?: boolean
    collapseTags?: boolean
    maxCollapseTags?: number
  }

  /**
   * Select 选项接口
   * @property {string | number} value - 选项值
   * @property {string} label - 选项标签
   * @property {boolean} disabled - 是否禁用该选项
   */
  export interface SelectOption {
    value: string | number
    label: string
    disabled?: boolean
  }

  export type TreeSelect = Select & Tree
}

export namespace zcUI {
  /**
   * CheckboxGroup 组件接口
   * @property {Object} props - 组件属性
   * @property {Function} emit - 组件事件发射函数
   */
  export interface GroupInject {
    emits: (event: 'change' | 'update:modelValue', value: (string | number)[]) => void
  }

  /**
   * Group 组件属性
   * @property {string} name - 组件名称
   * @property {string} align - 按钮组对齐方式：左对齐、居中对齐、右对齐
   * @property {boolean} inline - 是否为行内按钮组
   * @property {boolean} vertical - 是否垂直排列
   * @property {string|number} gap - 按钮之间的间距
   * @property {boolean} disabled - 是否禁用
   */
  export interface Group {
    modelValue?: (string | number)[] | (string | number | boolean)
    name?: string,
    align?: 'left' | 'center' | 'right'
    inline?: boolean
    vertical?: boolean
    gap?: string | number
    disabled?: boolean,
  }

  /**
   * Form 组件接口，继承自zcUIProps.Form
   * @property {Function} addField - 添加表单项字段方法
   * @property {Function} removeField - 移除表单项字段方法
   * @property {Function} validateField - 验证表单项方法
   */
  export interface Form extends zcUIProps.Form {
    addField: (field: zcUI.FormItem) => void
    removeField: (field: zcUI.FormItem) => void
    validateField: (prop: string) => Promise<boolean>
  }
  
  /**
   * FormItem 组件接口，继承自zcUIProps.FormItem
   * @property {Function} resetField - 重置表单项方法
   * @property {Function} validate - 验证表单项方法
   * @property {Function} clearValidate - 清除表单项验证结果方法
   */
  export interface FormItem extends zcUIProps.FormItem {
    resetField: () => void
    validate: (type?: 'change' | 'blur', value?: any) => Promise<{status: 'fulfilled' | 'rejected', reason?: string}>
    clearValidate?: () => void
  }

  /**
   * TableOptions 表格列选项接口
   * @property {string} type - 列类型：索引列、选择列
   * @property {string} label - 列标题
   * @property {string} prop - 列属性名
   * @property {string} fixed - 列固定位置：左侧、右侧
   * @property {string} align - 列对齐方式：左对齐、右对齐、居中对齐
   * @property {TableOptionsBtns[]} btns - 操作按钮配置
   * @property {string|number} width - 列宽度
   * @property {boolean} sortable - 是否可排序
   * @property {Function} formatter - 列内容格式化函数
   */
  export interface TableOptions extends TableCol {
    btns?: TableOptionsBtns[]
    children?: zcUI.TableOptions[]
    formatter?: (row: any, column: any, index: number) => string | number
  }

  export interface TableCol {
    type?: 'index' | 'selection'
    prop?: string
    label?: string
    width?: number | string
    fixed?: 'left' | 'right'
    align?: 'left' | 'right' | 'center'
    sortable?: boolean,
    formatter?: number | string
    tooltip?: zcUIProps.Tooltip
  }

  /**
   * TableOptionsBtns 表格操作按钮接口
   * @property {string} name - 按钮名称
   * @property {string} color - 按钮颜色
   * @property {Function} handle - 按钮点击处理函数
   */
  export interface TableOptionsBtns {
    name: string
    color?: string
    handle: (index: number, row: Record<string, any>) => void
  }

  /**
   * TreeNode
   * @property {[property: string]: any} [property: string]: any - 允许使用字符串索引
   * @property {TreeNode[]} children - 子节点
   * @property {boolean} expanded - 是否展开
   * @property {boolean} selected - 是否选中
   * @property {boolean} disabled - 是否禁用
   * @property {string} icon - 图标
   * @property {boolean} checked - 是否勾选
   * @property {boolean} indeterminate - 是否半选
   */
  export interface TreeNode {
    [property: string]: any
    children?: TreeNode[]
    expanded?: boolean
    selected?: boolean
    disabled?: boolean
    icon?: string
    checked?: boolean
    indeterminate?: boolean
  }
}