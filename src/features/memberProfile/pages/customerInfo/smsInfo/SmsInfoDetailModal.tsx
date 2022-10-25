import { IGetSMSInfoData } from 'features/memberProfile/type'
import { Descriptions, Modal, Tag, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { timeFormat } from 'common/utils/format'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

interface ISmsInfoDetailModalProps {
	record: IGetSMSInfoData | undefined
	visible: boolean
	onCancel: () => void
	timeZoneUtcOffset: number
}

const { Item } = Descriptions

const SmsInfoDetailModal = ({
	record,
	visible,
	onCancel,
	timeZoneUtcOffset,
}: ISmsInfoDetailModalProps) => {
	const { t } = useTranslation()
	const { sender, flag, title, content = '', createTime } = record ?? {}
	return (
		<Modal
			open={visible}
			destroyOnClose
			footer={null}
			onCancel={onCancel}
			width='60vw'
		>
			<Descriptions bordered column={2} size='middle'>
				<Item label={t('Label_CreateTime')} span={2}>
					{createTime ? (
						<Typography.Text style={{ whiteSpace: 'nowrap', padding: '5px' }}>
							{moment(createTime)
								.utcOffset(timeZoneUtcOffset)
								.format(timeFormat)}
						</Typography.Text>
					) : (
						''
					)}
				</Item>
				<Item label={t('Label_Sender')}>{sender}</Item>
				<Item label={t('Label_Read')}>
					{flag ? (
						<Tag icon={<CheckCircleOutlined />} color='success'>
							{t('Label_Read')}
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color='default'>
							{t('Label_UnRead')}
						</Tag>
					)}
				</Item>
				<Item label={t('Label_Subject')} span={2}>
					{title}
				</Item>
				<Item label={t('Label_Content')} span={2}>
					{/* eslint-disable-next-line react/no-danger */}
					<div dangerouslySetInnerHTML={{ __html: content }} />
				</Item>
			</Descriptions>
		</Modal>
	)
}

export { SmsInfoDetailModal }
