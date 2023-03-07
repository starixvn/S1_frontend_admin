import styled from 'styled-components'
import { Typography } from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'
import { LinkProps } from 'antd/lib/typography/Link'

// 單純給這頁使用的 Excel Icon
const StyleLink = styled(Typography.Link)`
	position: absolute;
	right: 30px;
	top: 5px;
	font-size: 1.5rem;
	z-index: 10;
`

const ExcelExportButton = (props: LinkProps) => {
	return (
		<StyleLink {...props}>
			<FileExcelOutlined />
		</StyleLink>
	)
}

export { ExcelExportButton }
