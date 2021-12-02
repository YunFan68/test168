import * as React from "react";
import * as moment from 'moment';
/**
 * 重要！！！
 * 请不要再在这里添加 lodash 的方法，也请尽量不要再这里 import 大的其它第三方库。
 * 会影响打包文件的大小的。
 */
const isEmpty = require('lodash/isEmpty');
const isNumber = require('lodash/isNumber');
// const isPlainObject = require('lodash/isPlainObject');
// const isFunction = require('lodash/isFunction');
const isEmptyObject = require('lodash/isEmpty');
// const isString = require('lodash/isString');
const isNaN = require('lodash/isNaN');
// const isBoolean = require('lodash/isBoolean');
const isEqual = require('lodash/isEqual');
const isDate = require('lodash/isDate');
const isObject = require('lodash/isObject');
// const isInteger = require('lodash/isInteger');
// const isArray = require('lodash/isArray');
const cloneDeep = require('lodash/cloneDeep');
const merge = require('lodash/merge');
// const reduce = require('lodash/reduce');
// const extend = require('lodash/extend');
// const indexOf = require('lodash/indexOf');
// const endsWith = require('lodash/endsWith');
// const map = require('lodash/map');
// const has = require('lodash/has');
// const each = require('lodash/each');
// const transform = require('lodash/transform');
const isNil = require('lodash/isNil');
// const hasProp = require('lodash/has');
// const trimStart = require('lodash/trimStart');
// const split = require('lodash/split');
// const head = require('lodash/head');
// const get = require('lodash/get');
// const set = require('lodash/set');
// const keys = require('lodash/keys');
const omitBy = require('lodash/omitBy');
// const intersection = require('lodash/intersection');
// const debounce = require('lodash/debounce');
const toNumber = require('lodash/toNumber');
const toString = require('lodash/toString');
const omit = require('lodash/omit');
// const replace = require('lodash/replace');
const parseInt = require('lodash/parseInt');
// const values = require('lodash/values');
// const without = require('lodash/without');
// const reduceRight = require('lodash/reduceRight');
// const trimEnd = require('lodash/trimEnd');
// const every = require('lodash/every');
// const filter = require('lodash/filter');
const pick = require('lodash/pick');
// const pickBy = require('lodash/pickBy');
// const toArray = require('lodash/toArray');
// const some = require('lodash/some');
// const ary = require('lodash/ary');
// const partial = require('lodash/partial');
// const max = require('lodash/max');
// const min = require('lodash/min');
// const isUndefined = require('lodash/isUndefined');
// const uniqueId = require('lodash/uniqueId');
// const partialRight = require('lodash/partialRight');
const assign = require('lodash/assign');
// const assignInWith = require('lodash/assignInWith');
// const mergeWith = require('lodash/mergeWith');
// const toPlainObject = require('lodash/toPlainObject');
const find = require('lodash/find');
// const range = require('lodash/range');
const union = require('lodash/union');
// const unionWith = require('lodash/unionWith');
// const concat = require('lodash/concat');
const findIndex = require('lodash/findIndex');
// const drop = require('lodash/drop');
// const uniqBy = require('lodash/uniqBy');
const remove = require('lodash/remove');
// const pull = require('lodash/pull');
// const isEqualWith = require('lodash/isEqualWith');
const difference = require('lodash/difference');
// const differenceWith = require('lodash/differenceWith');
const unionWith = require('lodash/unionWith');
const isArray = require('lodash/isArray');
const findKey = require('lodash/findKey');

import { toFixedWithZero } from '@chanjet/saas-voucher-formula';

/**
 * 因为原生的 toFixed 方法为 "四舍六入五取偶" 的规则, 即 5 的是按照情况进行进位的. (并且我实际测试的时候, 发现这种条件进位也很混乱)
 * 鉴于目前系统中 大量使用了 toFixed 方法, 所以此处对 Number 的 toFixed 方法进行覆写. 实现真正的 "四舍五入" 规则
 * 直接调用 BigDecimal 库~
 * @param {number} fixedNumber
 * @returns {string}
 */
Number.prototype.toFixed = function (fixedNumber) {
    return toFixedWithZero(this, fixedNumber);
};

/**
 * lw.add: 将Object数组按照某一属性转换为对象类型。
 * @params arr 对象数组
 * @params field 作为key的字段名
 */
const arrToObj = function (arr: Array<Object>, field: string): Object | any {
    if (arr.length) {
        const obj = {};
        arr.map((value, index) => {
            const key = value[field];
            if (key) {
                obj[key] = value;
            }
        });

        return obj;
    }
}

/**
 * lw.add: 将对象转换为数组
 */
const objToArr = function (obj: Object): Array<any> | any {
    const arr = [];
    for (const key in obj) {
        arr.push(obj[key]);
    }
    return arr;
}

/**
 * lw.add: 比较传入的两个对象或数组中各元素的值是否相等
 * @param originVal  初始值
 * @param variantVal  变化值
 * @param compareRules  比较规则（可选）。如果是对象数组，则该属性名表示item对象中的属性名。
 *        如果 compareRules 是由{fieldName, fieldValue}对象组成的数组，则表示fieldName的值变成fieldValue才算是变化了。
 * @param hierarchy 最多比较层数(由于性能消耗，默认只比较三级属性)
 * @returns {boolean} true表示两个变量没有发生变化。
 */
const compareDeep = function (
    originVal: Object | any[],
    variantVal: Object | any[],
    compareRules?: [string | { fieldName: string, fieldValue: any }],
    hierarchy = 3
): boolean {
    hierarchy--;
    if (originVal !== variantVal && hierarchy >= 0) {
        for (const index in originVal) {
            const originItem = originVal[index], variantItem = variantVal[index];
            const originIsObjOrArr = (originItem instanceof Object) || (originItem instanceof Array);
            const variantIsObjOrArr = (variantItem instanceof Object) || (variantItem instanceof Array);
            let compareRule;
            if (compareRules) {
                compareRule = find(compareRules, item => {
                    if (item instanceof Object) {
                        return item['fieldName'] === index;
                    } else {
                        return item === index;
                    }
                });
            }
            const isFieldName = !!compareRules ? !!compareRule : true;

            if (originIsObjOrArr && variantIsObjOrArr && !compareDeep(originItem, variantItem, compareRules, hierarchy)) {   // 任一层级的属性名都可以指定来比较
                return false;
            }

            if (!(originIsObjOrArr && variantIsObjOrArr) && isFieldName && originItem !== variantItem) {
                if (compareRule && compareRule instanceof Object && variantItem !== compareRule.fieldValue) {
                    continue;
                }
                return false;
            }
        }
    }
    return true;
}

/**
 * jiangmx.add: 日期format
 */
const dateFormat = function (date, format): string {
    if (!isDate(date) || date == 'Invalid Date') {
        return ""
    }
    const o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return format;
};

export const dateFormatFromString = function (dataString: string ,format: string) {
    const invalidStr = 'Invalid date';
    const returnResult = moment(dataString).format(format);
    if (returnResult === invalidStr) {
        return null;
    }
    return returnResult;
}

// 获取第二天
export const nextDate = function (date: Date): Date {
    if(!date){
        return null;
    }
    const time = date.getTime();
    return nextDateByTime(time);
}

// 获取第二天-时间戳
export const nextDateByTime = function (time: number): Date {
    if(!time){
        return null;
    }
    const nextDateTime = time + 24*60*60*1000;
    const nextDate = new Date();
    nextDate.setTime(nextDateTime);
    return nextDate;
}

/**
 * 格式化可能在样式中,传递具体的数字, 但是最后需要格式化微带单位的.
 * 比如传递的 10, 需要返回为 10px
 * added by zhangqingsong on 20170428.
 */
const formatCssNumber: (nu, postStr?) => string | number = (nu: number, postStr = "px") => {
    const strNu = toString(nu);
    if (strNu.indexOf("%") > -1) {

        const expectNumber = strNu.substring(0, strNu.length - 1);
        //包含 %的, 并且去除 % 都是数字.
        if (!isNaN(toNumber(expectNumber))) {
            return nu;
        }
    }

    if (!isNumber(parseInt(nu))) return 0;

    return nu + postStr;
};

/**
 * 复制文字到剪贴板的公共方法
 */
const copyToClipboard = (inp: HTMLInputElement) => {
    inp.select();

    try {
        // copy text
        // 复制文本
        document.execCommand('copy');
        inp.blur();
    }
    catch (err) {
        alert('please press Ctrl/Cmd+C to copy');
    }

}

/**
 * Convert string to base64
 */
const base64 = {
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function (string) {
        const characters = base64.characters;
        let result = '';

        let i = 0;
        do {
            let a = string.charCodeAt(i++);
            let b = string.charCodeAt(i++);
            let c = string.charCodeAt(i++);

            a = a ? a : 0;
            b = b ? b : 0;
            c = c ? c : 0;

            const b1 = (a >> 2) & 0x3F;
            const b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
            let b3 = ((b & 0xF) << 2) | ((c >> 6) & 0x3);
            let b4 = c & 0x3F;

            if (!b) {
                b3 = b4 = 64;
            } else if (!c) {
                b4 = 64;
            }

            result += base64.characters.charAt(b1) + base64.characters.charAt(b2) + base64.characters.charAt(b3) + base64.characters.charAt(b4);

        } while (i < string.length);

        return result;
    },

    decode: function (string) {
        const characters = base64.characters;
        let result = '';

        let i = 0;
        do {
            const b1 = base64.characters.indexOf(string.charAt(i++));
            const b2 = base64.characters.indexOf(string.charAt(i++));
            const b3 = base64.characters.indexOf(string.charAt(i++));
            const b4 = base64.characters.indexOf(string.charAt(i++));

            const a = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x3);
            const b = ((b2 & 0xF) << 4) | ((b3 >> 2) & 0xF);
            const c = ((b3 & 0x3) << 6) | (b4 & 0x3F);

            result += String.fromCharCode(a) + (b ? String.fromCharCode(b) : '') + (c ? String.fromCharCode(c) : '');

        } while (i < string.length);

        return result;
    }
};

// 添加事件
const addEvent = (elm, type, handler) => {
    if (!elm) {
        return false;
    }
    return elm.attachEvent ? elm.attachEvent("on" + type, handler) : elm.addEventListener(type, handler, false);
}

const removeEvent = (elm, type, handler) => {
    if (!elm) {
        return false;
    }
    return elm.detachEvent ? elm.detachEvent("on" + type, handler) : elm.removeEventListener(type, handler, false);
}

/**
 * 获取当天的0点时间
 */
const getZeroSecondOfDay: () => number = () => {
    return new Date(new Date().toLocaleDateString()).getTime();
}

/**
 * 获取当天的最后一秒时间
 */
const getLastSecondOfDay: () => number = () => {
    return new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime();
}

/**
 * 获取此时间与当前时间的最大值(比较晚的)
 */
const getLaterTime = (date: string|Date): Date => {

    let paramsDate;
    if (typeof date === 'object') {
        paramsDate = date;
    }
    else {
        paramsDate = new Date(date);
    }

    if (new Date(paramsDate).toString() === 'Invalid Date') {
        return new Date();
    }

    return new Date(Math.max(new Date(paramsDate).getTime(), new Date().getTime()));
};

/**
 * 获取时间天数差
 * @param startDate 开始日期,格式为 yyyy-MM-dd
 * @param endDate 结束日期,,格式为 yyyy-MM-dd
 */
function dateDiff(startDate, endDate) {
    const startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    const endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    const dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    return dates;
}


function extendChildren(children, extendedProps?: any, extendedChildren?: any) {
    return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
            return child;
        }

        const newProps = typeof extendedProps === 'function' ?
            extendedProps(child) : extendedProps;

        const newChildren = typeof extendedChildren === 'function' ?
            extendedChildren(child) : extendedChildren ?
                extendedChildren : child.props['children'];

        return React.cloneElement(child, newProps, newChildren);
    });
}

/**
 * lw.add: 解析当前 url 中的parameters
 */
const parseURLPara = function (): Object {
    const url = location.search; //获取url中"?"符后的字串
    const theRequest = {
        uriParams: url
    };
    if (url.indexOf("?") !== -1) {
        const str = url.substr(1);
        const strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

/**
 * mabj.add 四舍五入数字
*/
const round = function (value: number, scale: number): number {
    return Math.round(value * Math.pow(10, scale)) / Math.pow(10, scale);
}

/**
 * 检测传入的参数是否为空。其中，参数为数组、对象类型，也能判断
 * @param data
 */
const isEmptyForAny = function (data: any, option: {excludeZero?: boolean, excludeEmptyString?: boolean, excludeEmptyBoolean?: boolean, excludeEmptyPropWithObject?: boolean} = {excludeZero: false, excludeEmptyString: false, excludeEmptyBoolean: false, excludeEmptyPropWithObject: false}): boolean {
    if (!data) {
        if(option && option.excludeZero && data === 0) {
            return false;
        }

        if(option && option.excludeEmptyString && data === '') {
            return false;
        }
        if(option && option.excludeEmptyBoolean && (typeof data === "boolean")) {
            return false;
        }
        return true;
    }

    if (data instanceof Array && data.length === 0) {
        return true;
    }

    if (data instanceof Object) {
        if(Object.keys(data).length === 0) {
            return true;
        }

        if(option.excludeEmptyPropWithObject && !findKey(data, prop=> !isEmptyForAny(prop, {excludeEmptyBoolean: true, excludeEmptyString: true, excludeZero: true}))){
            return true;
        }
    }

    return false;
}

/**
 * 按照 fieldName array，获取object的值。
 * @param val
 * @param fieldPath
 */
const getGroupValue = function (val: any, fieldPath: Array<string>) {
    if (val === undefined) {
        return val;
    }

    if (fieldPath.length > 1) {
        const fieldName = fieldPath.shift();
        return getGroupValue(val[fieldName], fieldPath);
    }

    return val[fieldPath[0]];
}

/**
 * 将带.的属性重新组合
 * @param value
 */
const regroupValue = function (value): any {
    const result = {};
    if (!value) {
        return;
    }

    // 获取所有带点的字段
    const fieldNames = Object.keys(value).filter(key => key.indexOf('.') !== -1);

    for (const fieldName in value) {
        if (fieldNames.findIndex(i => i === fieldName) === -1) {
            result[fieldName] = value[fieldName];
        } else {
            // 按照 . 进行分割
            const fieldSplitArray = fieldName.split('.');
            // 逐层恢复结构
            let currentField = result;
            for (let i = 0; i < fieldSplitArray.length - 1; i++) {
                const currentName = fieldSplitArray[i];
                if (!currentField[currentName]) {
                    currentField[currentName] = {};
                }
                currentField = currentField[currentName];
            }

            // 最后赋值
            const lastName = fieldSplitArray[fieldSplitArray.length - 1];
            currentField[lastName] = value[fieldName];
        }
    }

    return result;
}

export const isPromise = function (e) {
    return !!e && typeof e.then == "function";
};

/**
 * 对 formatterText 函数 格式化的文本解译。
 * @param str
 * @param displayType 是否是针对input、textarea控件显示
 */
const deFormatterText = function (str: string, displayType: 'input' | 'grid' | 'other' = 'input'): string {
    const reg = new RegExp("<br>", "g");
    const regSpace = new RegExp("&nbsp;", "g");

    const escapeChars = function (chars: string): string {
        chars = (chars || '').replace(/&/g, '&amp;');
        chars = chars.replace(/</g, '&lt;');
        chars = chars.replace(/>/g, '&gt;');
        chars = chars.replace(/'/g, '&acute;');
        chars = chars.replace(/"/g, '&quot;');
        chars = chars.replace(/\|/g, '&brvbar;');

        return chars;
    }

    switch (displayType) {
        case 'input':
            str = (str || '').replace(reg, "\n");
            str = str.replace(regSpace, " ");
            break;
        case 'grid':
            str = (str || '').replace(reg, " ");
            str = str.replace(regSpace, " ");
            break;
        case 'other':
        default:
            str = (str || '').replace(reg, "\n");
            str = str.replace(regSpace, ' ');
            str = escapeChars(str);
            str = str.replace(new RegExp(" ", "g"), "&nbsp;");
            str = str.replace(new RegExp("\n", "g"), "<br>");
            break;
    }

    return str;
}

/**
 * 格式化文本信息，保留其换行符、空格等信息
 * @param str
 */
const formatterText = function (str): string {
    const reg = new RegExp("\n", "g");
    const regSpace = new RegExp(" ", "g");

    // str = (str || '').replace(reg, "<br>");
    // str = str.replace(regSpace, "&nbsp;");

    return str;
}

/**
 * 计算日期
 * @param interval 表示要添加的时间间隔
 * @param number 要添加的时间间隔的个数
 * @param initDate 时间对象
 */
const calculateDate = function (initDate: any, number = 0, interval = 'd') {
    const date = new Date(initDate);
    switch (interval) {
        case "y": {
            date.setFullYear(date.getFullYear() + number);
            return date;
        }
        case "q": {
            date.setMonth(date.getMonth() + number * 3);
            return date;
        }
        case "m": {
            date.setMonth(date.getMonth() + number);
            return date;
        }
        case "w": {
            date.setDate(date.getDate() + number * 7);
            return date;
        }
        case "d": {
            date.setDate(date.getDate() + number);
            return date;
        }
        case "h": {
            date.setHours(date.getHours() + number);
            return date;
        }
        case "m": {
            date.setMinutes(date.getMinutes() + number);
            return date;
        }
        case "s": {
            date.setSeconds(date.getSeconds() + number);
            return date;
        }
        default: {
            date.setDate(date.getDate() + number);
            return date;
        }
    }
}

/**
 * 图片尺寸定义
 * add by songxg
 * 2018/02/26
 */
const pictureSize = {
    bigger: {
        width: 500,
        height: 500,
        uri: '?x-oss-process=image/resize,w_500,limit_0',
    },
    big: {
        width: 360,
        height: 360,
        uri: '?x-oss-process=image/resize,w_360,limit_0',
    },
    upperMiddle: {
        width: 260,
        height: 260,
        uri: '?x-oss-process=image/resize,w_260,limit_0',
    },
    middle: {
        width: 100,
        height: 100,
        uri: '?x-oss-process=image/resize,w_100,limit_0',
    },
    small: {
        width: 24,
        height: 24,
        uri: '?x-oss-process=image/resize,w_24,limit_0',
    },
};

//通过 iconName 或者 name, 获取需要展示的内容
export function getButtonPopoverContent(name: string) {
    const strMap = {
        'add': '新增',
        'edit': '编辑',
        'remove': '删除',
        'copy': '行复制',
        'voucher-view': '查看详情',
        'share': '分享',
        'cust-custom': '公共属性',
        'employee-kickout': '踢出',
        'employee-kickout-new': '踢出',
        'employee-transfer': '移交管理权限',
        'shop-user-invite': '邀请',
        'shop-user-manage': '账号管理',
        'reconcile-dispose': "生成收款单",
        'reconcile-dispose-check': "确定审核",
        'circle-close': '取消选择',
        "icon-cust-delete": '删除',
        "icon-cust-merge": '合并',
        "icon-cust-view":"查看",
        "icon-cust-merge-approve": '同意',
        "icon-cust-reject": '拒绝',
        'icon-add-product-feature-type': '新增属性',
        'icon-edit-product-feature-type': '编辑属性',
        'icon-remove-product-feature-type': '删除属性',
        'icon-add-product-feature': '新增属性值',
        'icon-add-product-feature-group': '新增属性值分组',
        "zhuxiaojiami": '注销加密',
        'undo':"取消投放",
        'icon-live-put':"投放",
        'logOutPos': '注销加密',
        'resetPos': '重新使用',
        'terminate': '终止',
        'arrow-up': '上移',
        'arrow-down': '下移',
    };
    return strMap[name] || "";
}

/**
 * 按照给的时间维度返回具体的开始和结束时间, 默认返回当天
 * @param {"today" | "yesterday" | "month" | "year" | string} dimension
 * @param dateRange
 * @param {string} formatter
 * @returns 格式如下 [statDate, endDate]
 */
export const getDateScopeByDimension = (
          dimension: "today"| "yesterday"|"last7days"| "month"| "year"|string,
          dateRange?: Array<string>,
          formatter='YYYYMMDD'
): string[] => {

    const ret = [];
    switch (dimension) {
        case 'today':
            ret.push(moment().format(formatter));
            ret.push(moment().format(formatter));
            break;
        case 'yesterday':
            ret.push(moment().subtract(1, 'days').format(formatter));
            ret.push(moment().subtract(1, 'days').format(formatter));
            break;
        case 'last7days':
            ret.push(moment().subtract(6, 'days').format(formatter));
            ret.push(moment().format(formatter));
            break;
        case 'month':
            ret.push(moment().startOf('month').format(formatter));
            ret.push(moment().endOf('month').format(formatter));
            break;
        case 'year':
            ret.push(moment().startOf('year').format(formatter));
            ret.push(moment().endOf('year').format(formatter));
            break;
        case 'custom':
            ret.push(dateRange[0]);
            ret.push(dateRange[1]);
            break;
        default:
            ret.push(moment().format(formatter));
            ret.push(moment().format(formatter));
            break;

    }
    return ret;
};

export const nextYearScope = (formatter = "YYYYMMDD"): string[] => {
    return [
        moment().add(1, 'year').startOf('year').format(formatter),
        moment().add(1, 'year').endOf('year').format(formatter),
    ]
};

export const prevYearScope = (formatter = "YYYYMMDD"): string[] => {
    return [
        moment().subtract(1, 'year').startOf('year').format(formatter),
        moment().subtract(1, 'year').endOf('year').format(formatter),
    ]
};

export const recentOneMonth = (formatter = "YYYYMMDD", dateString?: string) => {
    if (dateString) {
        return [
            moment(dateString).startOf('month').format(formatter),
            moment(dateString).endOf('month').format(formatter),
        ]
    }
    return [
        moment().subtract(1, 'month').format(formatter),
        moment().format(formatter),
    ]
};



export const exceedDate = (str1, str2, days = 90) => {
  return moment(str2).diff(moment(str1), 'days') > days;
};

export const exportFileNamed = (dateString) => {
    let month = moment(dateString).month()+1;
    if(month<10) {
        month = `0${month}`;
    }
    return `${moment(dateString).year()}年${month}月`;
};

//将空格(包括内容中的) 全部取出
const trimAll = (target: string) => {
    if (!target) return "";
    if (typeof target !== "string") {target = String(target)}
    return target.replace(/\s+/g, '');
};

/**
 * 同向绝对值数值比较, num1 是基点数值。
 * eg:
 * 1) num1: -2, num2: -3, result: true
 * 1) num1: 2, num2: 3, result: true
 * 1) num1: -2, num2: 3, result: false
 * 1) num1: -2, num2: 1, result: false
 */
const compareWithSyntropyAbs = function(num1: number, num2: number): boolean {
    if(!isNumber(num1) && !isNumber(num2)) {
        return false;
    }
    if((num1 ^ num2) >= 0) {  // 同号
        return Math.abs(num1) <= Math.abs(num2);
    }

    return false;
}

/**
 * 直接在本页打开下载文件，不会自动打开txt等浏览器可识别文件
 * @param {string} url
 * @param {string} name
 */
const downLoadFile = (url, name?) => {
    const xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
        if (xhr.status === 200) {
            const blob = xhr.response;
            const a = document.createElement("a");
            a.download = name || "";
            a.href = URL.createObjectURL(blob);
            a.click();
            URL.revokeObjectURL(blob)
        }
    }
    xhr.send();

    //由于比较简单，就不用axios了
    // Axios.get(url,{responseType: 'blob'}).then((response) => {
    //     var blob = response && response["data"];
    //     var a = document.createElement("a");
    //     a.download = name || "";
    //     a.href = URL.createObjectURL(blob);
    //     a.click();
    // })
}

function isNilWithString(value){
    return isNil(value) || value.trim() === '';
}

function getType(o): 'string'|'number'|'array'|'boolean'|'function'|any {
    let oType = Object.prototype.toString.call(o);
    
    return oType.match(/\[object (.*?)\]/)[1].toLocaleLowerCase();
}

function isFunction(o) {
    let type = getType(o);
    if(type == 'function') {
        return true;
    }
    return false;
}

export {
    pick,
    parseInt,
    cloneDeep,
    merge,
    isNumber,
    isNil,
    isNilWithString,
    isEmptyObject,
    omitBy,
    toNumber,
    isNaN,
    isEqual,
    isDate,
    toString,
    omit,
    objToArr,
    arrToObj,
    assign,
    dateFormat,
    compareDeep,
    find,
    formatCssNumber,
    base64,
    union,
    unionWith,
    addEvent,
    removeEvent,
    findIndex,
    remove,
    copyToClipboard,
    difference,
    getZeroSecondOfDay,
    getLastSecondOfDay,
    extendChildren,
    parseURLPara,
    isEmptyForAny,
    getGroupValue,
    regroupValue,
    round,
    dateDiff,
    deFormatterText,
    formatterText,
    calculateDate,
    pictureSize,
    getLaterTime,
    trimAll,
    compareWithSyntropyAbs,
    downLoadFile,
    getType,
    isFunction,
}
