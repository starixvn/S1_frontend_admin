import { createGlobalStyle } from 'styled-components'

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
`

export default GlobalStyle
