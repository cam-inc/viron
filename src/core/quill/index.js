// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;

// Blot群。
import BlotBold from './blot/bold';
import BlotItalic from './blot/italic';
import BlotUnderline from './blot/underline';
import BlotStrike from './blot/strike';
import BlotLink from './blot/link';
import BlotCode from './blot/code';
import BlotScript from './blot/script';
import BlotImage from './blot/image';
import BlotVideo from './blot/video';
import BlotHeader from './blot/header';
import BlotList from './blot/list';
import BlotListItem from './blot/listItem';
import BlotBlockquote from './blot/blockquote';
import BlotCodeBlock from './blot/codeBlock';
// Attributor群。
import { AttributorClassColor, AttributorStyleColor } from './attributor/color';
import { AttributorClassBackground, AttributorStyleBackground } from './attributor/background';
import { AttributorClassFont, AttributorStyleFont } from './attributor/font';
import { AttributorClassSize, AttributorStyleSize } from './attributor/size';
import { AttributorClassIndent } from './attributor/indent';
import { AttributorClassAlign, AttributorStyleAlign } from './attributor/align';
import { AttributorClassDirection, AttributorStyleDirection } from './attributor/direction';

/**
 * BlotBoldを書き換えます。
 * @param {Object} params
 */
const customizeBlotBold = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotBold.className = className;
  }
  if (!!tagName) {
    BlotBold.tagName = tagName;
  }
  Quill.register(BlotBold);
};

/**
 * BlotItalicを書き換えます。
 * @param {Object} params
 */
const customizeBlotItalic = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotItalic.className = className;
  }
  if (!!tagName) {
    BlotItalic.tagName = tagName;
  }
  Quill.register(BlotItalic);
};

/**
 * BlotUnderlineを書き換えます。
 * @param {Object} params
 */
const customizeBlotUnderline = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotUnderline.className = className;
  }
  if (!!tagName) {
    BlotUnderline.tagName = tagName;
  }
  Quill.register(BlotUnderline);
};

/**
 * BlotStrikeを書き換えます。
 * @param {Object} params
 */
const customizeBlotStrike = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotStrike.className = className;
  }
  if (!!tagName) {
    BlotStrike.tagName = tagName;
  }
  Quill.register(BlotStrike);
};

/**
 * BlotLinkを書き換えます。
 * @param {Object} params
 */
const customizeBlotLink = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotLink.className = className;
  }
  if (!!tagName) {
    BlotLink.tagName = tagName;
  }
  Quill.register(BlotLink);
};

/**
 * BlotCodeを書き換えます。
 * @param {Object} params
 */
const customizeBlotCode = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotCode.className = className;
  }
  if (!!tagName) {
    BlotCode.tagName = tagName;
  }
  Quill.register(BlotCode);
};

/**
 * BlotScriptを書き換えます。
 * @param {Object} params
 */
const customizeBlotScript = params => {
  const { className } = params;
  if (!!className) {
    BlotScript.className = className;
  }
  Quill.register(BlotScript);
};

/**
 * BlotImageを書き換えます。
 * @param {Object} params
 */
const customizeBlotImage = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotImage.className = className;
  }
  if (!!tagName) {
    BlotImage.tagName = tagName;
  }
  Quill.register(BlotImage);
};

/**
 * BlotVideoを書き換えます。
 * @param {Object} params
 */
const customizeBlotVideo = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotVideo.className = className;
  }
  if (!!tagName) {
    BlotVideo.tagName = tagName;
  }
  Quill.register(BlotVideo);
};

/**
 * BlotHeaderを書き換えます。
 * @param {Object} params
 */
const customizeBlotHeader = params => {
  const { className } = params;
  if (!!className) {
    BlotHeader.className = className;
  }
  Quill.register(BlotHeader);
};

/**
 * BlotListを書き換えます。
 * @param {Object} params
 */
const customizeBlotList = params => {
  const { className } = params;
  if (!!className) {
    BlotList.className = className;
  }
  Quill.register(BlotList);
};

/**
 * BlotListItemを書き換えます。
 * @param {Object} params
 */
const customizeBlotListItem = params => {
  const { className } = params;
  if (!!className) {
    BlotListItem.className = className;
  }
  Quill.register(BlotListItem);
};

/**
 * BlotBlockquoteを書き換えます。
 * @param {Object} params
 */
const customizeBlotBlockquote = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotBlockquote.className = className;
  }
  if (!!tagName) {
    BlotBlockquote.tagName = tagName;
  }
  Quill.register(BlotBlockquote);
};

/**
 * BlotCodeBlockを書き換えます。
 * @param {Object} params
 */
const customizeBlotCodeBlock = params => {
  const { className, tagName } = params;
  if (!!className) {
    BlotCodeBlock.className = className;
  }
  if (!!tagName) {
    BlotCodeBlock.tagName = tagName;
  }
  Quill.register(BlotCodeBlock);
};

/**
 * AttributorColorを書き換えます。
 * @param {Object} params
 */
const customizeAttributorColor = params => {
  const { type = 'style', keyName } = params;
  if (type === 'style') {
    Quill.register(AttributorStyleColor, true);
  } else {
    if (!!keyName) {
      AttributorClassColor.keyName = keyName;
    }
    Quill.register(AttributorClassColor, true);
  }
};

/**
 * AttributorBackgroundを書き換えます。
 * @param {Object} params
 */
const customizeAttributorBackground = params => {
  const { type = 'style', keyName } = params;
  if (type === 'style') {
    Quill.register(AttributorStyleBackground, true);
  } else {
    if (!!keyName) {
      AttributorClassBackground.keyName = keyName;
    }
    Quill.register(AttributorClassBackground, true);
  }
};

/**
 * AttributorFontを書き換えます。
 * @param {Object} params
 */
const customizeAttributorFont = params => {
  const { type = 'style', keyName, whitelist = [] } = params;
  AttributorClassFont.whitelist = whitelist;
  if (type === 'style') {
    Quill.register(AttributorStyleFont, true);
  } else {
    if (!!keyName) {
      AttributorClassFont.keyName = keyName;
    }
    Quill.register(AttributorClassFont, true);
  }
};

/**
 * AttributorSizeを書き換えます。
 * @param {Object} params
 */
const customizeAttributorSize = params => {
  const { type = 'style', keyName, whitelist = [] } = params;
  AttributorClassSize.whitelist = whitelist;
  if (type === 'style') {
    Quill.register(AttributorStyleSize, true);
  } else {
    if (!!keyName) {
      AttributorClassSize.keyName = keyName;
    }
    Quill.register(AttributorClassSize, true);
  }
};

/**
 * AttributorIndentを書き換えます。
 * @param {Object} params
 */
const customizeAttributorIndent = params => {
  const { keyName } = params;
  if (!!keyName) {
    AttributorClassIndent.keyName = keyName;
  }
  Quill.register(AttributorClassIndent, true);
};

/**
 * AttributorAlignを書き換えます。
 * @param {Object} params
 */
const customizeAttributorAlign = params => {
  const { type = 'style', keyName } = params;
  if (type === 'style') {
    Quill.register(AttributorStyleAlign, true);
  } else {
    if (!!keyName) {
      AttributorClassAlign.keyName = keyName;
    }
    Quill.register(AttributorClassAlign, true);
  }
};

/**
 * AttributorDirectionを書き換えます。
 * @param {Object} params
 */
const customizeAttributorDirection = params => {
  const { type = 'style', keyName } = params;
  if (type === 'style') {
    Quill.register(AttributorStyleDirection, true);
  } else {
    if (!!keyName) {
      AttributorClassDirection.keyName = keyName;
    }
    Quill.register(AttributorClassDirection, true);
  }
};

/**
 * 指定Blotを書き換えます。
 * @param {String} blotName
 * @param {Object} params
 */
const customizeBlot = (blotName, params) => {
  switch (blotName) {
  case 'bold':
    customizeBlotBold(params);
    break;
  case 'italic':
    customizeBlotItalic(params);
    break;
  case 'underline':
    customizeBlotUnderline(params);
    break;
  case 'strike':
    customizeBlotStrike(params);
    break;
  case 'link':
    customizeBlotLink(params);
    break;
  case 'code':
    customizeBlotCode(params);
    break;
  case 'script':
    customizeBlotScript(params);
    break;
  case 'image':
    customizeBlotImage(params);
    break;
  case 'video':
    customizeBlotVideo(params);
    break;
  case 'header':
    customizeBlotHeader(params);
    break;
  case 'list':
    customizeBlotList(params);
    break;
  case 'list-item':
    customizeBlotListItem(params);
    break;
  case 'blockquote':
    customizeBlotBlockquote(params);
    break;
  case 'code-block':
    customizeBlotCodeBlock(params);
    break;
  case 'color':
    customizeAttributorColor(params);
    break;
  case 'background':
    customizeAttributorBackground(params);
    break;
  case 'font':
    customizeAttributorFont(params);
    break;
  case 'size':
    customizeAttributorSize(params);
    break;
  case 'indent':
    customizeAttributorIndent(params);
    break;
  case 'align':
    customizeAttributorAlign(params);
    break;
  case 'direction':
    customizeAttributorDirection(params);
    break;
  default:
    break;
  }
};

export default Quill;
export {
  customizeBlot
};
