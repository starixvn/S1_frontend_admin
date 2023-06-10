import { createGlobalStyle } from 'styled-components'
import 'antd/dist/antd.css'

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
  .ant-table-column-sorters{
    word-break: break-word;
  }
    }
    // withdrawalOperator 用的 row backGroundColor 
    .gray-background {
     background-color: #B8B8B8;
    }
    .gray-background > .ant-table-cell-row-hover {
     background-color: transparent !important;
    }
  .ant-table-column-sorters{
    word-break: break-word;
  }
`

export default GlobalStyle
