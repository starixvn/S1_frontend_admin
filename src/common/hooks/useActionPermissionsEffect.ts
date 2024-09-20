import { getActionPermissions } from 'common/utils'
import { find } from 'lodash'
import { useEffect } from 'react'
import { useAuth } from './useAuth'

/**
 * * 根據 functionId 給予當前功能頁權限
 */
const useActionPermissionsEffect = ({
	functionId,
}: {
	functionId: number | undefined
}) => {
	const { setActionPermissions, userMenuFunctionData } = useAuth()
	const menuFunctionData = find(userMenuFunctionData, { functionId })

	useEffect(() => {
		const newActionPermissions = getActionPermissions(
			menuFunctionData?.permission ?? []
		)

		setActionPermissions(newActionPermissions)
	}, [menuFunctionData?.functionId])
}

export { useActionPermissionsEffect }
