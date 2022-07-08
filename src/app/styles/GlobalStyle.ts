import { createGlobalStyle } from 'styled-components'
import 'antd/dist/antd.css'
import './editor.css'

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
`

export default GlobalStyle
