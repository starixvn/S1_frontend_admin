import styled from 'styled-components'
import { Upload } from 'antd'

// 使 upload 可以自動縮放至 100%
export const StyleUpload = styled(Upload)`
	.ant-upload {
		width: 100%;
	}
	.ant-upload > span > button {
		width: 100%;
	}
`
