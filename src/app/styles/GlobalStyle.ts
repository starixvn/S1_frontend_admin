import { createGlobalStyle } from 'styled-components'
import 'antd/dist/reset.css'

const GlobalStyle = createGlobalStyle`
  
  * {
    box-sizing: border-box;
    }
    
    .ant-menu-dark > .ant-menu-item:hover {
        background-color: transparent;
    }
    

    .ant-collapse {
      background: white;
    }

    .layout-header {
      padding:0;

      .ant-row {
        width: 100%
      }

      .ant-btn > span {
        color: white;
      }

      .ant-menu-horizontal .ant-menu-item {
        cursor: auto;    
      }
    }    
    
    .editable-row .ant-form-item-explain {
      position: absolute;
      top: 90%;
      font-size: 12px;
      .ant-form-item-explain-error {
        word-break: white-space:nowrap;
      }
    }

    // * 隱藏 antd image preview 多餘的區塊
    // * https://ant.design/components/image/#components-image-demo-controlled-preview
    .ant-image-mask {
      display: none;
    }
    
    // *  onFocus 時的 outline , 用於 WithdrawalOperator/ReceiptUploader 
    .highlight:focus {
     border-color: #1890ff;
    }
    // withdrawalOperator 用的 row backGroundColor 
    .gray-background {
     background-color: #B8B8B8;
    }
   .red-background {
      background-color: #ffd8d8;
    }
    .gray-background > .ant-table-cell-row-hover {
     background-color: transparent !important;
    }
  .ant-table-column-sorters{
    word-break: break-word;
  }

  // 日期輸入框旁的時區選單的左側圓角改為方角
  .ant-picker + * .ant-select-selector {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  // antd@5 的預設為 word-break: break-word 會導致現行表格內的文字被擠壓
  .ant-typography {
    word-break: normal;
  }

  // 使用等距數字 (同 antd@4 樣式) 
  body {
    font-feature-settings: 'tnum';
  }
`

export default GlobalStyle
