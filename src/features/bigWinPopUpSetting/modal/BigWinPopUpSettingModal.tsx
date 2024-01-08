import React from 'react'
import { FormInstance, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import BigWinPopUpSettingForm from 'features/bigWinPopUpSetting/modal/BigWinPopUpSettingForm'

interface IBigWinPopUpSettingModalProps {
	form: FormInstance<{
		siteId: number
		currencyId: number
		multipleOfWinning: number
		minOfWinning: number
		iTpCategoryList: number[]
	}>
	visible: boolean
	loading: boolean
	onCancel: () => void
	onSubmit: () => void
}

const BigWinPopUpSettingModal = ({
	form,
	visible,
	loading,
	onCancel,
	onSubmit,
}: IBigWinPopUpSettingModalProps) => {
	const { t } = useTranslation()
	return (
		<Modal
			width={660}
			open={visible}
			title={`${t('Label_Edit')} - ${t('Label_BigWinPopUpSetting')}`}
			okText={t('Label_Save')}
			cancelText={t('Label_Cancel')}
			confirmLoading={loading}
			onCancel={onCancel}
			onOk={onSubmit}
		>
			<BigWinPopUpSettingForm form={form} loading={loading} />
		</Modal>
	)
}

export default BigWinPopUpSettingModal
