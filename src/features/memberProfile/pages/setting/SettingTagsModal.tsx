import React, { useEffect } from 'react'
import Modal from 'antd/lib/modal/Modal'
import { ModalState, PAGINATION } from 'common/hooks'
import { ITagData } from 'features/memberProfile/type'
import { useTranslation } from 'react-i18next'
import {
	Button,
	Col,
	Form,
	message,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	TablePaginationConfig,
	Tag,
	Typography,
} from 'antd'
import {
	useLazyGetAllTagsQuery,
	useRemoveTagMutation,
	useAddTagMutation,
} from 'features/memberProfile/api'
import { filter, some } from 'lodash'

const { Option } = Select

interface ISettingTagsModalProps {
	custId: number
	tagsModal: ModalState
	tagList: ITagData[]
}

const SettingTagsModal = ({
	custId,
	tagsModal,
	tagList,
}: ISettingTagsModalProps) => {
	const { t } = useTranslation()
	const { visible, onCancel } = tagsModal
	const [form] = Form.useForm<{ tagId: number }>()

	const [getAllTags, { data: { data: allTags = [] } = {} }] =
		useLazyGetAllTagsQuery()

	const [addTag, { isLoading: isAddTagLoading }] = useAddTagMutation()

	const [removeTag] = useRemoveTagMutation()

	const handleSubmit = async () => {
		const { tagId } = form.getFieldsValue()
		await addTag({ custId, tagId }).unwrap()
		form.setFieldValue('tagId', null)
		message.success(t('System.Label_Success'))
	}

	const handleRemoveTag = async (tagId: number) => {
		try {
			await removeTag({ custId, tagId }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const tagListColumns = [
		{
			title: t('Label_Action'),
			key: 'action',
			width: '10%',
			align: 'center' as 'center',
			render: (record: ITagData) => {
				const { id } = record
				return (
					<Space size='middle' style={{ padding: '5px' }}>
						<Popconfirm
							title={t('Label_SureToDelete')}
							onConfirm={() => handleRemoveTag(id)}
						>
							<Typography.Link>{t('Label_Delete')}</Typography.Link>
						</Popconfirm>
					</Space>
				)
			},
		},
		{
			title: t('Label_TagName'),
			dataIndex: 'tagName',
			width: '25%',
			key: 'tagName',
			align: 'center' as 'center',
		},
		{
			title: t('Label_TagColor'),
			dataIndex: 'tagColour',
			width: '25%',
			key: 'tagColour',
			align: 'center' as 'center',
			render: (tagColour: string) => <Tag color={tagColour}>{tagColour}</Tag>,
		},
		{
			title: t('Label_Description'),
			dataIndex: 'description',
			width: '40%',
			key: 'description',
			align: 'center' as 'center',
		},
	]

	useEffect(() => {
		if (visible) {
			getAllTags(null)
		}
	}, [visible])

	/** 過濾掉已加入的 tags */
	const filterTags = filter(allTags, tag => !some(tagList, { id: tag.id }))

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			closable={false}
			width={600}
			footer={[
				<Button key='back' onClick={onCancel}>
					{t('Label_Close')}
				</Button>,
			]}
		>
			<Form
				layout='vertical'
				size='middle'
				form={form}
				initialValues={{ tagIds: [] }}
				onFinish={handleSubmit}
			>
				<Row align='middle' gutter={16}>
					<Col lg={18} md={18} xs={18}>
						<Form.Item name='tagId' label={t('Label_Tags')}>
							<Select
								style={{ width: '100%' }}
								placeholder={t('Label_Select')}
								/** 欄位是否可以搜尋 */
								showSearch
								/**
								 * 自定義搜尋過濾邏輯
								 * @param input 使用者輸入的搜尋字串
								 * @param option 下拉選單中的一個選項 */
								filterOption={(input, option) => {
									const isIncludes: boolean = String(option?.children)
										.toLowerCase()
										.includes(input.toLowerCase())
									return isIncludes
								}}
							>
								{filterTags?.map(tag => (
									<Option key={tag.id} value={tag.id}>
										{tag.tagName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col style={{ marginLeft: 'auto' }}>
						<Form.Item label=' '>
							<Button
								loading={isAddTagLoading}
								htmlType='submit'
								type='primary'
							>
								{t('Label_Add')}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>

			<Table
				bordered
				dataSource={tagList}
				columns={tagListColumns}
				pagination={PAGINATION as TablePaginationConfig}
			/>
		</Modal>
	)
}

export default SettingTagsModal
