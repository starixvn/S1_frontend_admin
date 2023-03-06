import moment from 'moment'
import { useEffect } from 'react'
import { find, isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { List, Form, Modal, message, Typography } from 'antd'
import { selectUserSite } from 'common/enum'
import { useAuth, useModal, useQueryParams } from 'common/hooks'
import { useAppSelector } from 'app/store'
import { LayoutContent } from 'app/pages/layout'
import { dateRangeToUtcFormatter } from 'common/utils'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { AffixButtons } from 'components/AffixButtons'
import { useTimeZone } from 'components/TimeZoneSelect'
import {
	IAddForm,
	IFilterForm,
	ICryptoWalletGetByAddress,
} from 'features/blockCryptoWallet/type'
import {
	useGetCryptoInfoDataQuery,
	useReleaseCryptoWalletMutation,
	useBlockCryptoWalletSetMutation,
	useLazyGetBlockCryptoWalletQuery,
	useLazyCryptoWalletGetByAddressQuery,
} from 'features/blockCryptoWallet/api'
import { BlockCryptoWalletTable } from 'features/blockCryptoWallet/BlockCryptoWalletTable'
import { BlockCryptoWalletModal } from 'features/blockCryptoWallet/BlockCryptoWalletModal'
import { BlockCryptoWalletFilter } from 'features/blockCryptoWallet/BlockCryptoWalletFilter'

const BlockCryptoWallet = ({ pageTitle = '' }: { pageTitle?: string }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const [queryParams, setQueryParams] = useQueryParams()
	const { timeZoneUtcOffset, onTimeZoneChange } = useTimeZone()
	const { actionPermissions: { editPermission, deletePermission } = {} } =
		useAuth()

	const addModal = useModal()
	const [filterForm] = Form.useForm<IFilterForm>()
	const [addForm] = Form.useForm<IAddForm>()

	const {
		data: { data: blockStatusEnumList = [] } = {},
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BlockCryptoStatus' })

	const {
		data: { data: cryptoInfoData } = {},
		isLoading: isGetCryptoInfoDataLoading,
	} = useGetCryptoInfoDataQuery()

	const [
		getBlockCryptoWalletList,
		{
			data: { data: blockCryptoWalletList = [] } = {},
			isFetching: isGetBlockCryptoWalletListLoading,
		},
	] = useLazyGetBlockCryptoWalletQuery()

	const [
		getCryptoWalletByAddress,
		{ isFetching: isGetCryptoWalletByAddressLoading },
	] = useLazyCryptoWalletGetByAddressQuery()

	const [setBlockCryptoWallet, { isLoading: isSetBlockCryptoWalletLoading }] =
		useBlockCryptoWalletSetMutation()

	const [
		setReleaseCryptoWallet,
		{ isLoading: isSetReleaseCryptoWalletLoading },
	] = useReleaseCryptoWalletMutation()

	const handleSearch = async ({
		currentTimeZoneUtcOffset = timeZoneUtcOffset,
	}: {
		currentTimeZoneUtcOffset?: number
	}) => {
		const {
			dateRange,
			currencyId,
			status,
			cryptoType,
			network,
			address,
			userName,
		} = filterForm.getFieldsValue()

		const [startDate, endDate] = dateRangeToUtcFormatter(
			dateRange,
			currentTimeZoneUtcOffset
		)

		const payload = {
			startDate,
			endDate,
			status,
			address: address ?? '',
			userName: userName ?? '',
			currencyId,
			cryptoType,
			network,
		}

		try {
			await getBlockCryptoWalletList(payload).unwrap()
			setQueryParams({
				...payload,
				status: status === 0 ? '0' : status,
				timeZone: currentTimeZoneUtcOffset,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleBlockCryptoWallet = async ({
		address,
		blockStatus,
	}: {
		address: string
		blockStatus: number
	}) => {
		try {
			const { data: cryptoWalletGetByAddress } = await getCryptoWalletByAddress(
				{ address }
			).unwrap()

			onOpenCryptoWalletInfo({ address, blockStatus, cryptoWalletGetByAddress })
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const onOpenCryptoWalletInfo = ({
		address,
		blockStatus,
		cryptoWalletGetByAddress,
	}: {
		address: string
		blockStatus: number
		cryptoWalletGetByAddress: ICryptoWalletGetByAddress[]
	}) => {
		const blockStatusName = find(
			blockStatusEnumList,
			({ value }) => value === blockStatus
		)?.name
		const okText =
			blockStatusName === 'Block' ? t('Label_Unlock') : t('Label_Block')

		Modal.info({
			title: t('Label_UserList'),
			closable: true,
			okText,
			okButtonProps: { disabled: !editPermission?.canUse },
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
							dataSource={cryptoWalletGetByAddress ?? []}
							renderItem={data => (
								<List.Item>
									<Typography.Text>{data.userName}</Typography.Text>
								</List.Item>
							)}
						/>
					</div>
				</>
			),
			onOk() {
				handleSetBlockCryptoWallet({ address, blockStatus })
			},
		})
	}

	const handleSetBlockCryptoWallet = async ({
		address: existAddress,
		blockStatus,
	}: {
		address?: string
		blockStatus?: number
	}) => {
		const isAdd = !existAddress

		const afterStatus = isAdd
			? find(blockStatusEnumList, ({ name }) => name === 'Unlock')?.value
			: find(
					blockStatusEnumList,
					({ value }) => value !== 0 && value !== blockStatus
			  )?.value

		try {
			const { address: addAddress } = await addForm.validateFields()
			const address = isAdd ? addAddress : existAddress

			const before = {
				address,
				status: blockStatus,
			}
			const after = {
				address,
				status: afterStatus,
				memo: '',
			}

			await setBlockCryptoWallet({
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

	const handleAddBlockCryptoWallet = async () => {
		const { address } = await addForm.validateFields()

		const blockStatus = find(
			blockStatusEnumList,
			({ name }) => name === 'Unlock'
		)?.value

		handleSetBlockCryptoWallet({ address, blockStatus })
		addModal.onCancel()
	}

	const handleReleaseCryptoWallet = ({
		address,
		network,
		currencyId,
		cryptoCurrencyId,
		custId,
	}: {
		address: string
		network: string
		currencyId: number
		custId: number
		cryptoCurrencyId?: number
	}) => {
		const paylod = {
			siteId,
			currencyId,
			before: {
				address,
				network,
				currencyId: cryptoCurrencyId,
				custId,
			},
		}

		try {
			setReleaseCryptoWallet(paylod).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (!isEmpty(queryParams)) {
			const {
				startDate,
				endDate,
				timeZone,
				address,
				userName,
				currencyId,
				cryptoType,
				network,
				status,
			} = queryParams

			onTimeZoneChange(Number(timeZone))
			filterForm.setFieldsValue({
				dateRange: [moment(startDate), moment(endDate)],
				status: Number(status),
				address,
				userName,
				currencyId: currencyId?.map((id: string) => Number(id)),
				cryptoType: cryptoType?.map((id: string) => Number(id)),
				network,
			})

			handleSearch({
				currentTimeZoneUtcOffset: Number(timeZone),
			})
		} else if (!isGetStatusListLoading && !isGetCryptoInfoDataLoading) {
			filterForm.setFieldsValue({
				cryptoType: cryptoInfoData?.cryptoCurrency.map(
					({ currencyId }) => currencyId
				),
				network: cryptoInfoData?.cryptoNetwork.map(({ network }) => network),
				status: blockStatusEnumList[0].value,
			})
		}
	}, [isGetStatusListLoading, isGetCryptoInfoDataLoading])

	const loading =
		isGetStatusListLoading ||
		isGetCryptoInfoDataLoading ||
		isGetBlockCryptoWalletListLoading ||
		isGetCryptoWalletByAddressLoading ||
		isSetBlockCryptoWalletLoading ||
		isSetReleaseCryptoWalletLoading

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle} />
			<BlockCryptoWalletFilter
				form={filterForm}
				loading={loading}
				timeZoneUtcOffset={timeZoneUtcOffset}
				cryptoNetworkList={cryptoInfoData?.cryptoNetwork ?? []}
				cryptoCurrencyList={cryptoInfoData?.cryptoCurrency ?? []}
				blockStatusEnumList={blockStatusEnumList}
				onSearch={handleSearch}
				onTimeZoneChange={onTimeZoneChange}
			/>
			{!isEmpty(queryParams) && (
				<BlockCryptoWalletTable
					loading={loading}
					deletePermission={deletePermission}
					timeZoneUtcOffset={timeZoneUtcOffset}
					cryptoCurrencyList={cryptoInfoData?.cryptoCurrency ?? []}
					blockStatusEnumList={blockStatusEnumList}
					blockCryptoWalletList={blockCryptoWalletList}
					onBlockCryptoWallet={handleBlockCryptoWallet}
					onReleaseCryptoWallet={handleReleaseCryptoWallet}
				/>
			)}
			<BlockCryptoWalletModal
				form={addForm}
				open={addModal.visible}
				loading={isSetBlockCryptoWalletLoading}
				onCancel={addModal.onCancel}
				onFinish={handleAddBlockCryptoWallet}
			/>
			<AffixButtons>
				<AffixButtons.Create
					disabled={!editPermission?.canUse}
					onClick={() => {
						addModal.onOpen()
					}}
				/>
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default BlockCryptoWallet
