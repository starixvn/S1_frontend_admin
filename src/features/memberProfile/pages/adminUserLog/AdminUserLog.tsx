import { Fragment } from 'react'
import { LayoutContent } from 'app/pages/layout'

const AdminUserLog = () => {
	return (
		<LayoutContent.Card>
			AdminUserLog
			{
				// indicates very long content
				Array.from({ length: 10 }, (_, index) => (
					<Fragment key={index}>
						{index % 20 === 0 && index ? 'more' : '...'}
						<br />
					</Fragment>
				))
			}
		</LayoutContent.Card>
	)
}

export default AdminUserLog
