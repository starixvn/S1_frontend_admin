import { FC, ReactElement, useEffect } from 'react'
import { Iframe } from 'components'
import { useAuth } from 'common/hooks'
import { Spin } from 'antd'
import { Navigate, useLocation } from 'react-router-dom'
import paths from 'app/constants/paths'

interface InternalAuthRequireProps {
	internalFunctionKey?: string
}

const InternalAuthRequire: FC<InternalAuthRequireProps> = ({
	internalFunctionKey,
	children,
}) => {
	const { auth, internalAuth, onInternalCheckSignIn } = useAuth()
	const location = useLocation()

	const redirectPath = `Home/Signin?redirectUrl=${internalFunctionKey}`

	useEffect(() => {
		onInternalCheckSignIn()
	}, [location.pathname])

	if (auth.isLogin === false)
		return (
			<Navigate
				to={`/${paths.login.root}`}
				state={{ from: location }}
				replace
			/>
		)

	if (internalAuth.isLogin === undefined)
		return (
			<Spin
				spinning={internalAuth.isLogin === undefined}
				style={{ height: '100vh' }}
			/>
		)

	return internalAuth.isLogin ? (
		(children as ReactElement)
	) : (
		<Iframe path={redirectPath} />
	)
}

export { InternalAuthRequire }
