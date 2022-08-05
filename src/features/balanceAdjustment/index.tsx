import { FC, useState } from 'react'
import { useAuth, useQueryParams } from 'common/hooks'
import { includes } from 'lodash'
import { LayoutContent } from 'app/pages/layout'
import BalanceAdjustment from './balanceAdjustment/BalanceAdjustment'
import ThirdPartyAdjustment from './thirdPartyAdjustment/ThirdPartyAdjustment'
import { ADJUSTMENT_METHOD_TYPE_LIST, MethodTypeEnum } from './constants'
import { IMethodType } from './type'

// * Method Type 只渲染有權限的選項
const getFilteredMethodType = () => {
	const {
		actionPermissions: {
			addBatchPermission,
			addPermission,
			add3RDPermission,
		} = {},
	} = useAuth()

	const permissionIds = [addBatchPermission, addPermission, add3RDPermission]
		.map(item => item?.canUse && item?.permissionId)
		.filter(Boolean)

	const filteredMethodTypes: IMethodType[] = ADJUSTMENT_METHOD_TYPE_LIST.filter(
		({ value }) => includes(permissionIds, value)
	)

	return filteredMethodTypes
}

const Page: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const filteredMethodTypes = getFilteredMethodType()
	const [queryParams, setQueryParams] = useQueryParams()
	const [methodType, setMethodType] = useState<MethodTypeEnum>(
		queryParams?.methodType
			? Number(queryParams?.methodType)
			: filteredMethodTypes[0]?.value
	)

	const handleMethodTypeChange = (type: MethodTypeEnum) => {
		setMethodType(type)
		setQueryParams({
			methodType: type,
		})
	}

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			{methodType === MethodTypeEnum.thirdPartyWallet ? (
				<ThirdPartyAdjustment
					methodType={methodType}
					filteredMethodTypes={filteredMethodTypes}
					onMethodTypeChange={handleMethodTypeChange}
				/>
			) : (
				<BalanceAdjustment
					methodType={methodType}
					filteredMethodTypes={filteredMethodTypes}
					onMethodTypeChange={handleMethodTypeChange}
				/>
			)}
		</LayoutContent.Main>
	)
}

export default Page
