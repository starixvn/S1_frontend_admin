import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table } from 'components'
import { timeFormat } from 'common/utils/format'
import { useTimeZone } from 'components/TimeZoneSelect'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, Col, Typography, Row, Modal } from 'antd'
import { useGetCustRealNameChangeLogQuery } from 'features/memberProfile/api'
import {
	ISettingInfoPermissions,
	SettingEditTypeEnum,
} from 'features/memberProfile/type'

interface ISettingInfoCardProps {
	infoPermissions: ISettingInfoPermissions
	openTagsModal: () => void
	openVipLevelModal: () => void
	onEditTypeChange: (newEditType: SettingEditTypeEnum | undefined) => void
}

const SettingInfoCard = ({
	infoPermissions: {
		editFullNamePermission,
		editEMailPermission,
		editPhoneNumberPermission,
		changeVIPLevelPermission,
		editBirthdayPermission,
		editAddressPermission,
		editTagPermission,
	},
	openTagsModal,
	openVipLevelModal,
	onEditTypeChange,
}: ISettingInfoCardProps) => {
	const { t } = useTranslation()
	const { custId: originCustId } = useParams()
	const custId = Number(originCustId)
	const { timeZoneUtcOffset } = useTimeZone()

	const columns = [
		{
			title: t('Label_BeforeName'),
			key: 'beforeName',
			dataIndex: 'beforeName',
			width: 100,
			align: 'center' as 'center',
			render: (beforeName: string) => beforeName || '-',
		},
		{
			title: t('Label_AfterName'),
			key: 'afterName',
			dataIndex: 'afterName',
			width: 100,
			align: 'center' as 'center',
			render: (afterName: string) => afterName || '-',
		},
		{
			title: t('Label_UpdateTime'),
			key: 'updateTime',
			dataIndex: 'updateTime',
			width: 150,
			align: 'center' as 'center',
			render: (updateTime: string) =>
				updateTime ? (
					<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
						{dayjs(updateTime).utcOffset(timeZoneUtcOffset).format(timeFormat)}
					</Typography.Text>
				) : (
					''
				),
		},
		{
			title: t('Label_Operator'),
			key: 'operator',
			dataIndex: 'operator',
			width: 80,
			align: 'center' as 'center',
			render: (operator: string) => (
				<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
					{operator ?? 'N/A'}
				</Typography.Text>
			),
		},
	]

	const {
		data: { data: custRealNameChangeLogList = [] } = {},
		isFetching: custRealNameChangeLogFetching,
	} = useGetCustRealNameChangeLogQuery(
		{
			custId: Number(custId),
		},
		{
			skip: !custId,
		}
	)

	const handleOpenCustRealNameChangeLogInfoModal = async () => {
		if (!custId) return

		Modal.info({
			title: t('Label_FullNameChangeLog'),
			closable: true,
			content: (
				<Table
					loading={custRealNameChangeLogFetching}
					pagination={false}
					style={{
						marginTop: '20px',
						marginBottom: '10px',
						marginRight: '10px',
						marginLeft: '-20px',
					}}
					dataSource={custRealNameChangeLogList}
					columns={columns}
				/>
			),
			width: '720px',
		})
	}

	return (
		<Col xxl={5} xl={5} lg={12} span={12} style={{ marginBottom: 8 }}>
			<Card title={t('Label_Info')} style={{ height: '100%' }}>
				<p>
					<Row align='middle'>
						<Col span={18}>
							<Typography.Link
								disabled={!editFullNamePermission?.canUse}
								onClick={() => onEditTypeChange(SettingEditTypeEnum.FullName)}
							>
								{t('Label_FullName')}
							</Typography.Link>
						</Col>
						<Col span={3} offset={3}>
							<Button
								type='link'
								style={{ padding: '0px' }}
								icon={<InfoCircleOutlined style={{ fontSize: '18px' }} />}
								onClick={handleOpenCustRealNameChangeLogInfoModal}
							/>
						</Col>
					</Row>
				</p>
				<p>
					<Typography.Link
						disabled={!editEMailPermission?.canUse}
						onClick={() => onEditTypeChange(SettingEditTypeEnum.Email)}
					>
						{t('Label_Email')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						disabled={!editPhoneNumberPermission?.canUse}
						onClick={() => onEditTypeChange(SettingEditTypeEnum.PhoneNo)}
					>
						{t('Label_PhoneNumber')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						disabled={!changeVIPLevelPermission?.canUse}
						onClick={openVipLevelModal}
					>
						{t('Label_VipLevel')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						disabled={!editBirthdayPermission?.canUse}
						onClick={() => onEditTypeChange(SettingEditTypeEnum.Birthday)}
					>
						{t('Label_Birthday')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						disabled={!editAddressPermission?.canUse}
						onClick={() => onEditTypeChange(SettingEditTypeEnum.Address)}
					>
						{t('Label_ShippingAddress')}
					</Typography.Link>
				</p>
				<p>
					<Typography.Link
						disabled={!editTagPermission?.canUse}
						onClick={openTagsModal}
					>
						{t('Label_Tag')}
					</Typography.Link>
				</p>
			</Card>
			<br />
		</Col>
	)
}

export default SettingInfoCard
