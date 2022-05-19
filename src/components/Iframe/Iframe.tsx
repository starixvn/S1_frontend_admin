import _ from 'lodash'

const Iframe = ({ path }: { path: string }) => {
	return (
		<iframe
			style={{ width: '100%', height: '100%', border: 'none' }}
			title={_.replace(path || '', '/', ' ')}
			src={`/${path}`}
		/>
	)
}

export { Iframe }
