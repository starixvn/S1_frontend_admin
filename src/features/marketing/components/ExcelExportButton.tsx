import styled from 'styled-components'
import { Typography } from 'antd'
import { FileExcelOutlined } from '@ant-design/icons'
import { LinkProps } from 'antd/lib/typography/Link'

// Excel Icon for Marketing
const StyleLink = styled(Typography.Link)`
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
