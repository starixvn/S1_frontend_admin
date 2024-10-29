import { getActionPermissions } from 'common/utils'
import { find } from 'lodash'
import { useAuth } from './useAuth'

/**
 * * 找尋指定 functionId 功能頁權限
 */
const useActionPermissionsByFunctionId = ({
	functionId,
}: {
	functionId: number | undefined
}) => {
	const { userMenuFunctionData } = useAuth()
	const menuFunctionData = find(userMenuFunctionData, { functionId })
	const actionPermissions = getActionPermissions(
		menuFunctionData?.permission ?? []
	)
	return { actionPermissions }
}

export { useActionPermissionsByFunctionId }
