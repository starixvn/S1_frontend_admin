import { FC } from 'react'
import { message, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { CopyOutlined } from '@ant-design/icons'
import { IGetRedemptionDetailData } from 'features/redemptionListing/type'
import copy from 'copy-to-clipboard'

interface ShippingInformationTableInterface {
	redemptionDetail: IGetRedemptionDetailData
}
const StyleDiv = styled.div`
	background: #ececec;
	padding: 20px;
	width: 100%;
	margin-bottom: 20px;
`

const ShippingInformationTable: FC<ShippingInformationTableInterface> = ({
	redemptionDetail,
}) => {
	const { t } = useTranslation()
	const {
		phoneNo,
		accountName,
		areaCode,
		city,
		state,
		country,
		postCode,
		lineFirst,
		lineSecond,
	} = redemptionDetail

	const address = `${lineFirst},${lineSecond},${city},${postCode},${country},${state}`
	const handleCopy = async () => {
		if (copy(address)) {
			message.success(`${t('Label_MemberAddress')}  ${t('Label_Copied')}`)
		} else {
			message.error(t('Label_TryAgain'))
		}
	}
	return (
		<StyleDiv>
			<Space direction='vertical'>
				<Typography.Title level={5}>
					{t('Label_ShippingInformation')}
				</Typography.Title>
				<Typography.Text>{`${t(
					'Label_MemberName'
				)} :  ${accountName}`}</Typography.Text>
				<Typography.Text>{`${t(
					'Label_MemberPhone'
				)} :  ( ${areaCode} ) ${phoneNo}`}</Typography.Text>
				<Typography.Text>
					{`${t('Label_MemberAddress')} :  ${address}`}
					<CopyOutlined
						onClick={handleCopy}
						style={{ marginLeft: '10px', fontSize: '1.1rem' }}
					/>
				</Typography.Text>
			</Space>
		</StyleDiv>
	)
}

export { ShippingInformationTable }
