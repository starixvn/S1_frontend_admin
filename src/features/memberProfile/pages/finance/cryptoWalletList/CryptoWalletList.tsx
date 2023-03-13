import { List, Modal, message, Typography } from 'antd'
import { find } from 'lodash'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutContent } from 'app/pages/layout'
import {
	useLazyGetCryptoListByCustIdQuery,
	useReleaseCryptoWalletMutation,
	useBlockCryptoWalletSetMutation,
	useLazyCryptoWalletGetByAddressQuery,
} from 'features/blockCryptoWallet/api'
import { CryptoWalletListTable } from 'features/memberProfile/pages/finance/cryptoWalletList/CryptoWalletListTable'
import { selectUserSite } from 'common/enum'
import { useGetEnumTypeQuery } from 'common/service/enumApi'
import { useTimeZone } from 'components/TimeZoneSelect'
import { useAppSelector } from 'app/store'
import { ICryptoWalletGetByAddress } from 'features/blockCryptoWallet/type'

const CryptoWalletList = () => {
	const { t } = useTranslation()
	const { custId } = useParams()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { timeZoneUtcOffset } = useTimeZone()

	const {
		data: { data: blockStatusEnumList = [] } = {},
		isLoading: isGetStatusListLoading,
	} = useGetEnumTypeQuery({ enumName: 'BlockCryptoStatus' })

	const [
		getCryptoListByCustId,
		{
			data: { data: cryptoWalletList = [] } = {},
			isFetching: isGetCryptoListByCustIdLoading,
		},
	] = useLazyGetCryptoListByCustIdQuery()

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

			onOpenCryptoWalletInfo({
				address,
				blockStatus,
				cryptoWalletGetByAddress,
			})
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleSetBlockCryptoWallet = async ({
		address,
		blockStatus,
	}: {
		address?: string
		blockStatus?: number
	}) => {
		const afterStatus = find(
			blockStatusEnumList,
			// value 0 is select all
			({ value }) => value !== 0 && value !== blockStatus
		)?.value

		try {
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

	const handleReleaseCryptoWallet = ({
		address,
		network,
		cryptoCurrencyId,
	}: {
		address: string
		network: string
		cryptoCurrencyId?: number
	}) => {
		const paylod = {
			siteId,
			before: {
				address,
				network,
				currencyId: cryptoCurrencyId,
				custId: Number(custId),
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

	const loading =
		isGetCryptoListByCustIdLoading ||
		isGetStatusListLoading ||
		isGetCryptoWalletByAddressLoading ||
		isSetBlockCryptoWalletLoading ||
		isSetReleaseCryptoWalletLoading

	const handleSearch = async () => {
		if (!custId) return

		try {
			await getCryptoListByCustId({ custId: Number(custId) }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	useEffect(() => {
		if (custId) {
			handleSearch()
		}
	}, [custId])

	return (
		<>
			<LayoutContent.Title
				title={t('MemberProfile.Menu.Finance.Label_CryptoWalletList')}
			/>
			{custId && (
				<CryptoWalletListTable
					loading={loading}
					cryptoWalletList={cryptoWalletList}
					timeZoneUtcOffset={timeZoneUtcOffset}
					blockStatusEnumList={blockStatusEnumList}
					onBlockCryptoWallet={handleBlockCryptoWallet}
					onReleaseCryptoWallet={handleReleaseCryptoWallet}
				/>
			)}
		</>
	)
}

export default CryptoWalletList
