import { Fragment } from 'react'

const MemberProfileSiderContent = () => {
	return (
		<div>
			content
			{
				// indicates very long content
				Array.from({ length: 50 }, (_, index) => (
					<Fragment key={index}>
						{index % 20 === 0 && index ? 'more' : '...'}
						<br />
					</Fragment>
				))
			}
		</div>
	)
}

export default MemberProfileSiderContent
