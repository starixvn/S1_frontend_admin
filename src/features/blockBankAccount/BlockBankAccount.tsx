import _ from 'lodash'
import moment from 'moment'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { withOutSiteIdParams } from 'common/utils'
import { useQueryParams } from 'common/hooks'
import { dateRangeToUtcFormatter, useTimeZone } from 'components/TimeZoneSelect'
import { selectUserSite } from 'common/enum'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { Form, List, message, Modal, Typography } from 'antd'
import { IAxiosResponse } from 'common/service/axiosBaseQuery'
import BlockBankAccountFilter from './BlockBankAccountFilter'
import BlockBankAccountTable from './BlockBankAccountTable'
import {
	useLazyGetBlockBankAccListQuery,
	useLazyGetBlockBankAccQuery,
	useSetBlockAccountMutation,
} from './api'
import { BANK_BLOCK_STATUS_VALUE_OPTIONS } from './constants'
import { IBlockBankAccListResponse, IBlockBankAccState } from './type'

const BlockBankAccount: FC = () => {
	const { t } = useTranslation()
	const userSite = useAppSelector(selectUserSite)

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

	const handleBlockBankAcc = async ({
		sysId,
		accountNum,
		status,
	}: {
		sysId: number
		accountNum: string
		status: number
	}) => {
		try {
			const { data: blockBankAccListData } = await getBlockBankAccList({
				sysId,
				accountNum,
			}).unwrap()

			onOpenBlockBankAccInfo({
				sysId,
				accountNum,
				status,
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
		status,
		blockBankAccListData,
	}: {
		sysId: number
		accountNum: string
		status: number
		blockBankAccListData: IBlockBankAccListResponse[] | null
	}) => {
		const okText =
			status === BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK
				? t('Label_Unlock')
				: t('Label_Lock')

		const toggledStatus =
			status === BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK
				? BANK_BLOCK_STATUS_VALUE_OPTIONS.UNLOCK
				: BANK_BLOCK_STATUS_VALUE_OPTIONS.LOCK

		Modal.info({
			title: t('Label_UserList'),
			closable: true,
			okText,
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
		if (!userSite?.siteId) return

		const init = async () => {
			if (_.isEmpty(withOutSiteIdParams(queryParams))) return

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
	}, [userSite?.siteId])

	const loading = isBlockBankAccFetching || isGetBlockBankAccListFetching

	return (
		<main>
			<LayoutContent.Title title='block bank account' />

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
				onBlockBankAcc={handleBlockBankAcc}
			/>
		</main>
	)
}

export default BlockBankAccount
