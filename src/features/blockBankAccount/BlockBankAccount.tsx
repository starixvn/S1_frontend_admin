import { isEmpty } from 'lodash'
import moment from 'moment'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { dateRangeToUtcFormatter, withOutSiteIdParams } from 'common/utils'
import { useAuth, useQueryParams } from 'common/hooks'
import { useTimeZone } from 'components/TimeZoneSelect'
import { LayoutContent } from 'app/pages/layout'
import { Form, List, message, Modal, Typography } from 'antd'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import BlockBankAccountFilter from './BlockBankAccountFilter'
import BlockBankAccountTable from './BlockBankAccountTable'
import {
	useLazyGetBlockBankAccListQuery,
	useLazyGetBlockBankAccQuery,
	useSetBlockAccountMutation,
	useSetReleaseAccountMutation,
} from './api'
import { BANK_BLOCK_STATUS_VALUE_OPTIONS } from './constants'
import {
	IBlockBankAccListResponse,
	IBlockBankAccState,
	ISetReleaseAccountArgs,
} from './type'

const BlockBankAccount: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { actionPermissions: { editPermission, deletePermission } = {} } =
		useAuth()
	const [queryParams, setQueryParams] = useQueryParams()
	const [form] = Form.useForm()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()

	const [
		getBlockBankAcc,
		{
			data: { data: blockBankAccData } = {} as IAxiosResponse<
				IBlockBankAccState[]
			>,
			isFetching: isBlockBankAccFetching,
		},
	] = useLazyGetBlockBankAccQuery()

	const [getBlockBankAccList, { isFetching: isGetBlockBankAccListFetching }] =
		useLazyGetBlockBankAccListQuery()

	const [setBlockAccount] = useSetBlockAccountMutation()

	const [setReleaseAccount] = useSetReleaseAccountMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}) => {
		const {
			accountNum = '',
			userName = '',
			status,
			dateRange,
		} = form.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		try {
			await getBlockBankAcc({
				startDate,
				endDate,
				accountNum,
				userName,
				status,
			}).unwrap()

			setQueryParams({
				startDate,
				endDate,
				accountNum,
				userName,
				status,
				tz: currentTimeZoneUtcOffset,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetReleaseAccount = async ({
		sysId,
		accountNum,
		ifscCode,
		custId,
	}: ISetReleaseAccountArgs) => {
		try {
			setReleaseAccount({
				sysId,
				accountNum,
				ifscCode,
				custId,
			}).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleBlockBankAcc = async ({
		sysId,
		accountNum,
		blockStatus,
	}: {
		sysId: number
		accountNum: string
		blockStatus: number
	}) => {
		try {
			const { data: blockBankAccListData } = await getBlockBankAccList({
				sysId,
				accountNum,
			}).unwrap()

			onOpenBlockBankAccInfo({
				sysId,
				accountNum,
				blockStatus,
				blockBankAccListData,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const onOpenBlockBankAccInfo = ({
		sysId,
		accountNum,
		blockStatus,
		blockBankAccListData,
	}: {
		sysId: number
		accountNum: string
		blockStatus: number
		blockBankAccListData: IBlockBankAccListResponse[] | null
	}) => {
		const okText =
			blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK
				? t('Label_Unlock')
				: t('Label_Lock')

		const toggledStatus =
			blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK
				? BANK_BLOCK_STATUS_VALUE_OPTIONS.UNLOCK
				: BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK

		Modal.info({
			title: t('Label_UserList'),
			closable: true,
			okText,
			okButtonProps: {
				disabled: !editPermission?.canUse,
			},
			content: (
				<>
					<h5>{t('Label_BlockBankAccInfoDescribe1')}</h5>

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
							dataSource={blockBankAccListData ?? []}
							renderItem={blockBankAccListItem => (
								<List.Item>
									<Typography.Text>
										{blockBankAccListItem.userName}
									</Typography.Text>
								</List.Item>
							)}
						/>
					</div>
				</>
			),
			onOk() {
				handleSetBlockAccount({
					sysId,
					accountNum,
					status: toggledStatus,
				})
			},
		})
	}

	const handleSetBlockAccount = async ({
		sysId,
		accountNum,
		status,
	}: {
		sysId: number
		accountNum: string
		status: number
	}) => {
		try {
			await setBlockAccount({
				sysId,
				accountNum,
				status,
				memo: '',
			}).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		const init = async () => {
			if (isEmpty(withOutSiteIdParams(queryParams))) return

			const {
				startDate,
				endDate,
				userName = '',
				accountNum = '',
				status = BANK_BLOCK_STATUS_VALUE_OPTIONS.ALL,
				tz,
			} = queryParams

			onTimeZoneChange(Number(tz))

			form.setFieldsValue({
				status: Number(status),
				userName,
				accountNum,
				dateRange: [moment(startDate), moment(endDate)],
			})

			handleSearch({
				currentTimeZoneUtcOffset: Number(tz),
			})
		}

		init()
	}, [])

	const loading = isBlockBankAccFetching || isGetBlockBankAccListFetching

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />

			<BlockBankAccountFilter
				loading={loading}
				form={form}
				timeZoneUtcOffset={timeZoneUtcOffset}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>

			<BlockBankAccountTable
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				blockBankAccData={blockBankAccData ?? []}
				deletePermission={deletePermission}
				onBlockBankAcc={handleBlockBankAcc}
				onSetReleaseAccount={handleSetReleaseAccount}
			/>
		</LayoutContent.Main>
	)
}

export default BlockBankAccount
