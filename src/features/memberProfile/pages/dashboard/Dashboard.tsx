import { Fragment } from 'react'
import { LayoutContent } from 'app/pages/layout'

const Dashboard = () => {
	return (
		<LayoutContent.Card>
			Dashboard
			{
				// indicates very long content
				Array.from({ length: 100 }, (_, index) => (
					<Fragment key={index}>
						{index % 20 === 0 && index ? 'more' : '...'}
						<br />
					</Fragment>
				))
			}
		</LayoutContent.Card>
	)
}

export default Dashboard
