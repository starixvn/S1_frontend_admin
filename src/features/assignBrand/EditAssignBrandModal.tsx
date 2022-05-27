import { FC } from 'react'
import _ from 'lodash'
import { Checkbox, message, Modal, Spin } from 'antd'
import { ModalState } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { BrandState } from './type'
import { useSetAdminBrandMutation } from './api'

interface EditAssignBrandModalProps {
	modal: ModalState
	editUserId?: number
	editBrands: BrandState[]
	userBrands: BrandState[]
}
const EditAssignBrandModal: FC<EditAssignBrandModalProps> = ({
	modal,
	editUserId,
	editBrands,
	userBrands,
}) => {
	const { t } = useTranslation()
	const { visible, onCancel } = modal

	const [setAdminBrand, { isLoading: isSetAdminBrandLoading }] =
		useSetAdminBrandMutation()

	const handleSetAdminBrand = async ({
		siteId,
		userId,
		status,
	}: {
		siteId: number
		userId?: number
		status: number
	}) => {
		try {
			await setAdminBrand({ siteId, userId, status }).unwrap()
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	// user can not edit
	const differenceBrands = _.differenceBy(
		editBrands,
		userBrands,
		item => item.siteId
	)

	return (
		<Modal
			visible={visible}
			width={240}
			title={t('Label_SetBrand')}
			onCancel={onCancel}
			footer={null}
		>
			<Spin spinning={isSetAdminBrandLoading}>
				{differenceBrands?.map(differenceBrand => (
					<>
						<Checkbox
							key={differenceBrand.siteId}
							value={differenceBrand.siteId}
							checked
							disabled
						>
							{differenceBrand.siteName}
						</Checkbox>
						<br />
					</>
				))}

				{userBrands?.map(userBrand => {
					const checked = editBrands.some(
						({ siteId }) => siteId === userBrand.siteId
					)

					return (
						<>
							<Checkbox
								key={userBrand.siteId}
								value={userBrand.siteId}
								disabled={checked && editBrands.length === 1}
								checked={checked}
								onChange={() =>
									handleSetAdminBrand({
										siteId: userBrand.siteId,
										userId: editUserId,
										status: checked ? 0 : 1,
									})
								}
							>
								{userBrand.siteName}
							</Checkbox>
							<br />
						</>
					)
				})}
			</Spin>
		</Modal>
	)
}

export default EditAssignBrandModal
