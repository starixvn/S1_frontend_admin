import { FC, useEffect } from 'react'
import { Form, List, message, Modal, Typography } from 'antd'
import moment from 'moment'
import { find, isEmpty } from 'lodash'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'app/store'
import { useAuth, useQueryParams } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { LayoutContent } from 'app/pages/layout'
import {
	useGetEWalletTypesQuery,
	useLazyGetBlockEWalletAccQuery,
	useLazyGetBlockEWalletListQuery,
	useSetBlockEWalletMutation,
	useSetReleaseEWalletMutation,
} from './api'
import BlockEWalletFilter from './BlockEWalletFilter'
import BlockEWalletTable from './BlockEWalletTable'
import {
	IBlockEWalletAccData,
	IBlockEWalletData,
	IBlockEWalletForm,
} from './type'
import { BANK_BLOCK_STATUS_VALUE_OPTIONS } from './constants'

const BlockEWallet: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission, deletePermission } = {} } =
		useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [form] = Form.useForm<IBlockEWalletForm>()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)

	const [
		getBlockEWalletAcc,
		{
			data: { data: blockEWalletAccounts = [] } = {},
			isFetching: isGetBlockEWalletAccFetching,
		},
	] = useLazyGetBlockEWalletAccQuery()

	const [getBlockEWalletList, { isFetching: isGetBlockEWalletListFetching }] =
		useLazyGetBlockEWalletListQuery()

	const {
		data: { data: eWalletTypes = [] } = {},
		isFetching: isGetEWalletTypesFetching,
	} = useGetEWalletTypesQuery(null)

	const [setBlockEWallet, { isLoading: isSetBlockEWalletLoading }] =
		useSetBlockEWalletMutation()

	const [setReleaseEWallet, { isLoading: isSetReleaseEWalletLoading }] =
		useSetReleaseEWalletMutation()

	const handleChangeCurrency = (newCurrencyIds: number[]) => {
		if (newCurrencyIds.includes(0)) {
			form.setFieldsValue({
				currencyIds: currencyListBySite?.map(item => item.currencyId),
			})
		} else {
			form.setFieldsValue({
				currencyIds: newCurrencyIds,
			})
		}
	}

	const handleChangeEWalletTypes = (newEWalletIds: number[]) => {
		if (newEWalletIds.includes(0)) {
			form.setFieldsValue({
				eWalletIds: eWalletTypes?.map(item => item.sysId),
			})
		} else {
			form.setFieldsValue({
				eWalletIds: newEWalletIds,
			})
		}
	}

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}) => {
		const {
			dateRange,
			currencyIds,
			blockStatus,
			accountNum,
			userName,
			eWalletIds,
		} = (await form.validateFields()) as IBlockEWalletForm

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			await getBlockEWalletAcc({
				accountNum,
				userName,
				blockStatus,
				startDate,
				endDate,
				currencyId: currencyIds,
				eWalletId: eWalletIds,
			}).unwrap()

			setQueryParams({
				startDate,
				endDate,
				accountNum,
				userName,
				blockStatus,
				currencyIds,
				eWalletIds,
				tz: currentTimeZoneUtcOffset,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// * Block E-Wallet step1: 撈出會受影響的用戶列表
	const handleBlockEWallet = async ({
		sysId,
		accountNum,
		blockStatus,
	}: {
		sysId: number
		accountNum: string
		blockStatus: number
	}) => {
		try {
			const { data: blockEWalletList } = await getBlockEWalletList({
				sysId,
				accountNum,
			}).unwrap()

			onOpenBlockEWalletInfo({
				sysId,
				accountNum,
				blockStatus,
				blockEWalletList,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// * Block E-wallet step2: 顯示會受影響的用戶列表彈窗
	const onOpenBlockEWalletInfo = ({
		sysId,
		accountNum,
		blockStatus,
		blockEWalletList,
	}: {
		sysId: number
		accountNum: string
		blockStatus: number
		blockEWalletList: IBlockEWalletData[] | null
	}) => {
		// * okText 顯示當前 blockStatus 的反義詞
		const okText =
			blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK
				? t('Label_Unlock')
				: t('Label_Block')

		// * status 傳入 blockStatus 的反義狀態
		const toggledStatus =
			blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK
				? BANK_BLOCK_STATUS_VALUE_OPTIONS.OPEN
				: BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK

		Modal.info({
			title: t('Label_UserList'),
			closable: true,
			okText,
			okButtonProps: {
				disabled: !editPermission?.canUse,
			},
			content: (
				<>
					<h5>{t('Label_BlockBankInfoDescribe1')}</h5>

					<div
						style={{
							maxHeight: 400,
							overflow: 'auto',
						}}
					>
						<List
							size='small'
							itemLayout='horizontal'
							bordered
							dataSource={blockEWalletList ?? []}
							renderItem={blockEWalletListItem => (
								<List.Item>
									<Typography.Text>
										{blockEWalletListItem.userName}
									</Typography.Text>
								</List.Item>
							)}
						/>
					</div>
				</>
			),
			onOk() {
				handleSetBlockEWallet({
					sysId,
					accountNum,
					status: toggledStatus,
				})
			},
		})
	}

	// * Block E-Wallet step3: 實際執行 block e-wallet
	const handleSetBlockEWallet = async ({
		sysId,
		accountNum,
		status,
	}: {
		sysId: number
		accountNum: string
		status: number
	}) => {
		try {
			const before = find(blockEWalletAccounts, {
				sysId,
			}) as IBlockEWalletAccData

			await setBlockEWallet({
				siteId,
				before,
				after: {
					sysId,
					accountNum,
					status,
					memo: '', // * 不需要 memo 故帶空值
				},
			}).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	//  * Release E-Wallet
	const handleSetReleaseEWallet = async ({
		sysId,
		accountNum,
		custId,
	}: {
		sysId: number
		accountNum: string
		custId: number
	}) => {
		try {
			setReleaseEWallet({
				siteId,
				before: {
					sysId,
					accountNum,
					custId,
					ifscCode: '', // * E-Wallet 沒有 `ifscCode` 故帶空值
				},
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// * 初始 Filter 資訊
	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const {
				startDate,
				endDate,
				accountNum = '',
				userName = '',
				blockStatus = BANK_BLOCK_STATUS_VALUE_OPTIONS.ALL,
				currencyIds,
				eWalletIds,
				tz,
			} = queryParams

			onTimeZoneChange(Number(tz))

			form.setFieldsValue({
				blockStatus: Number(blockStatus),
				userName,
				accountNum,
				currencyIds:
					currencyIds?.map((currencyId: string) => Number(currencyId)) ?? [],
				eWalletIds:
					eWalletIds?.map((eWalletId: string) => Number(eWalletId)) ?? [],
				dateRange: [moment(startDate), moment(endDate)],
			})

			handleSearch({
				currentTimeZoneUtcOffset: Number(tz),
			})
		} else {
			form.setFieldsValue({
				eWalletIds: eWalletTypes?.map(eWalletType => eWalletType.sysId),
			})

			handleSearch({})
		}
	}, [isGetEWalletTypesFetching])

	const loading =
		isGetBlockEWalletAccFetching ||
		isGetBlockEWalletListFetching ||
		isSetBlockEWalletLoading ||
		isSetReleaseEWalletLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<BlockEWalletFilter
				loading={loading}
				form={form}
				eWalletTypes={eWalletTypes}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onTimeZoneChange={onTimeZoneChange}
				onChangeCurrency={handleChangeCurrency}
				onChangeEWalletTypes={handleChangeEWalletTypes}
				onSearch={handleSearch}
			/>

			{!isEmpty(queryParams) && (
				<BlockEWalletTable
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					blockEWalletAccounts={blockEWalletAccounts}
					deletePermission={deletePermission}
					onBlockEWallet={handleBlockEWallet}
					onSetReleaseEWallet={handleSetReleaseEWallet}
				/>
			)}
		</LayoutContent.Main>
	)
}

export default BlockEWallet
