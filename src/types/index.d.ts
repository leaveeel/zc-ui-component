import { zcUI, zcUIProps, zcIcon as zcIconTypes } from './zcUI'
import { App, Plugin, Directive } from 'vue';

export const zcLoading: {
  show: () => void;
  hide: () => void;
};

export const loadingDirective: Directive;

export const zcMessage: {
  (options: zcUIProps.MessageBox): void;
};

export declare const zcUIComponent: Plugin;

export const zcButton: zcUIProps.Button;
export const zcButtonGroup: zcUIProps.ButtonGroup;
export const zcCard: zcUIProps.Card;
export const zcCheckbox: zcUIProps.Checkbox;
export const zcCheckboxGroup: zcUIProps.CheckboxGroup;
export const zcDialog: zcUIProps.Dialog;
export const zcForm: zcUIProps.Form;
export const zcFormItem: zcUIProps.FormItem;
export const zcInput: zcUIProps.Input;
export const zcIcon: zcIconTypes.Icon;
export const zcImage: zcUIProps.Image;
export const zcPagination: zcUIProps.Pagination;
export const zcRadio: zcUIProps.Radio;
export const zcRadioGroup: zcUIProps.RadioGroup;
export const zcScroll: zcUIProps.Scroll;
export const zcTable: zcUIProps.Table;
export const zcTooltip: zcUIProps.Tooltip;
export const IconChecked: Plugin;
export const IconClose: Plugin;
export const IconLoading: Plugin;
export const IconRightArrow: Plugin;
export const zcSwitch: zcUIProps.Switch
export const zcDatePicker: zcUIProps.DatePicker
export const zcTree: zcUIProps.Tree
export const zcSelect: zcUIProps.Select

export const zcToast: {
  (message: string, options?: zcUIProps.Toast): void;
};

export type {
  zcUI,
  zcUIProps,
  zcIconTypes
}

export default zcUIComponent;