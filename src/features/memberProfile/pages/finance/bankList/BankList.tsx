import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IGetBankListResponse } from 'features/memberProfile/type'
import { LayoutContent } from 'app/pages/layout'
import { List, message, Modal, TablePaginationConfig, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { PAGINATION, usePagination } from 'common/hooks'
import BankListTable from 'features/memberProfile/pages/finance/bankList/BankListTable'
import { useLazyGetBankListQuery } from 'features/memberProfile/api'
import { IBlockBankAccListResponse } from 'features/blockBankAccount/type'
import { BANK_BLOCK_STATUS_VALUE_OPTIONS } from 'features/blockBankAccount/constants'
import {
	useLazyGetBlockBankAccListQuery,
	useSetBlockAccountMutation,
	useSetReleaseAccountMutation,
} from 'features/blockBankAccount/api'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

const BankList = () => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getBankList,
		{
			data: {
				data: bankList = [],
				rowCount: custBankListTotal = 0,
			} = {} as IGetBankListResponse,
			isFetching: isGetBankListLoading,
		},
	] = useLazyGetBankListQuery()
	const [getBlockBankAccList, { isFetching: isGetBlockBankAccListFetching }] =
		useLazyGetBlockBankAccListQuery()
	const [setBlockAccount, { isLoading: isSetBlockAccountLoading }] =
		useSetBlockAccountMutation()
	const [setReleaseAccount, { isLoading: isSetReleaseAccountLoading }] =
		useSetReleaseAccountMutation()
	const [pagination, setPagination] = usePagination({
		paginationTotal: custBankListTotal,
	})

	const handleSearch = async ({
		current = PAGINATION.defaultCurrent,
		pageSize = PAGINATION.defaultPageSize,
	}: {
		current?: number | undefined
		pageSize?: number | undefined
	}) => {
		if (!custId) return
		try {
			await getBankList({
				custId: Number(custId),
			}).unwrap()
			setPagination(prev => ({ ...prev, current, pageSize }))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleTableChange = async (newPagination: TablePaginationConfig) => {
		const { current, pageSize } = newPagination

		await handleSearch({
			current,
			pageSize,
		})
	}

	const handleSetReleaseAccount = async ({
		sysId,
		accountNum,
		ifscCode,
		selectedId,
	}: {
		sysId: number
		accountNum: string
		selectedId: number
		ifscCode: string
	}) => {
		try {
			setReleaseAccount({
				siteId,
				before: {
					sysId,
					accountNum,
					custId: selectedId,
					ifscCode,
				},
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
			blockStatus === BANK_BLOCK_STATUS_VALUE_OPTIONS.BLOCK
				? t('Label_Unlock')
				: t('Label_Lock')

		Modal.info({
			title: t('Label_UserList'),
			closable: true,
			okText,
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
					blockStatus,
				})
			},
		})
	}

	const handleSetBlockAccount = async ({
		sysId,
		accountNum,
		blockStatus,
	}: {
		sysId: number
		accountNum: string
		blockStatus: number
	}) => {
		const { BLOCK, OPEN } = BANK_BLOCK_STATUS_VALUE_OPTIONS
		try {
			const before = {
				sysId,
				accountNum,
				status: blockStatus,
			}
			const after = {
				sysId,
				accountNum,
				status: blockStatus === BLOCK ? OPEN : BLOCK,
				memo: '',
			}

			await setBlockAccount({
				siteId,
				before,
				after,
			}).unwrap()

			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId, isSetBlockAccountLoading, isSetReleaseAccountLoading])

	const loading =
		isGetBankListLoading ||
		isGetBlockBankAccListFetching ||
		isSetBlockAccountLoading ||
		isSetReleaseAccountLoading
	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_BankList')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<BankListTable
					bankList={bankList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					onBlockBankAcc={handleBlockBankAcc}
					onSetReleaseAccount={handleSetReleaseAccount}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default BankList
