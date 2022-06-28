import { replace } from 'lodash'

const Iframe = ({ path }: { path: string }) => {
	return (
		<iframe
			style={{ width: '100%', height: '100%', border: 'none' }}
			title={replace(path || '', '/', ' ')}
			src={`/${path}`}
		/>
	)
}

export { Iframe }
