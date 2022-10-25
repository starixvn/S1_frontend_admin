import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import { List, message, Modal, TablePaginationConfig, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { useTimeZone } from 'components/TimeZoneSelect'
import { PAGINATION, usePagination } from 'common/hooks'
import EWalletListTable from 'features/memberProfile/pages/finance/eWalletList/EWalletListTable'
import { useLazyGetEWalletListQuery } from 'features/memberProfile/api'
import { IGetEWalletListResponse } from 'features/memberProfile/type'
import {
	useLazyGetBlockEWalletListQuery,
	useSetBlockEWalletMutation,
	useSetReleaseEWalletMutation,
} from 'features/blockEWallet/api'
import {
	IBlockEWalletAccData,
	IBlockEWalletData,
} from 'features/blockEWallet/type'
import { BANK_BLOCK_STATUS_VALUE_OPTIONS } from 'features/blockEWallet/constants'
import { find } from 'lodash'
import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'

const EWalletList = () => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { custId } = useParams()
	const { timeZoneUtcOffset } = useTimeZone()

	const [
		getEWalletList,
		{
			data: {
				data: eWalletList = [],
				rowCount: custEWalletListTotal = 0,
			} = {} as IGetEWalletListResponse,
			isFetching: isGetEWalletListLoading,
		},
	] = useLazyGetEWalletListQuery()

	const [getBlockEWalletList, { isFetching: isGetBlockEWalletListFetching }] =
		useLazyGetBlockEWalletListQuery()

	const [setBlockEWallet, { isLoading: isSetBlockEWalletLoading }] =
		useSetBlockEWalletMutation()

	const [setReleaseEWallet, { isLoading: isSetReleaseEWalletLoading }] =
		useSetReleaseEWalletMutation()

	const [pagination, setPagination] = usePagination({
		paginationTotal: custEWalletListTotal,
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
			await getEWalletList({
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
			const before = find(eWalletList, {
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
		selectedId,
	}: {
		sysId: number
		accountNum: string
		selectedId: number
	}) => {
		try {
			setReleaseEWallet({
				siteId,
				before: {
					sysId,
					accountNum,
					custId: selectedId,
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

	useEffect(() => {
		if (custId) {
			handleSearch({})
		}
	}, [custId, isSetBlockEWalletLoading, isSetReleaseEWalletLoading])

	const loading =
		isGetEWalletListLoading ||
		isGetBlockEWalletListFetching ||
		isSetBlockEWalletLoading ||
		isSetReleaseEWalletLoading

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_EWalletList')}
			/>
			<LayoutContent.Card style={{ marginTop: -20 }}>
				<EWalletListTable
					eWalletList={eWalletList}
					loading={loading}
					timeZoneUtcOffset={timeZoneUtcOffset}
					pagination={pagination}
					onTableChange={handleTableChange}
					onBlockEWallet={handleBlockEWallet}
					onSetReleaseEWallet={handleSetReleaseEWallet}
				/>
			</LayoutContent.Card>
		</>
	)
}

export default EWalletList
