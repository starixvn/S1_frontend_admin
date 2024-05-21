import { FC, useContext, useEffect, useState } from 'react'
import { Form, Modal, Row } from 'antd'
import { TinymceEditor } from 'components'
import { EditBonusContext } from 'features/bonusManagement/editBonusDetail/editBonusContext'

interface IEditDetailModalProps {
	visible: boolean
	onFinish: () => void
	infoTabsKey: string
}

const EditDetailModal: FC<IEditDetailModalProps> = ({
	visible,
	onFinish,
	infoTabsKey,
}) => {
	const { form, editPermission } = useContext(EditBonusContext)
	const [defaultState, setDefaultState] = useState('')
	const onHtmlStateChange = (newHtml: string) => {
		form?.setFieldsValue({
			details: {
				[infoTabsKey]: {
					detail: newHtml,
				},
			},
		})
	}

	useEffect(() => {
		setDefaultState(form?.getFieldValue(['details', infoTabsKey, 'detail']))
	}, [visible])
	return (
		<Modal
			open={visible}
			onCancel={onFinish}
			onOk={onFinish}
			width='70vw'
			// 因為會自動存入 form 表單 , 所以 footer 給空 , 不顯示平常顯示的 save 或 cancel
			footer={[]}
		>
			<Form form={form} layout='vertical'>
				<Row justify='center' align='middle'>
					<Form.Item name={['details', infoTabsKey, 'detail']}>
						<TinymceEditor
							defaultHtmlState={defaultState}
							onHtmlStateChange={onHtmlStateChange}
							darkMode
							disabled={!editPermission?.canUse}
						/>
					</Form.Item>
				</Row>
			</Form>
		</Modal>
	)
}

export { EditDetailModal }
