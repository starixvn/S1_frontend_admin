import { LayoutContent } from 'app/pages/layout'
import React, { Fragment } from 'react'

const Setting = () => {
	return (
		<LayoutContent.Card>
			Setting
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

export default Setting
