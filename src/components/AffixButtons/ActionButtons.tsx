import {
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	SyncOutlined,
} from '@ant-design/icons'
import { ButtonProps } from 'antd'
import { BiExport } from 'react-icons/bi'
import StyledButton from './StyledButton'

const CreateButton = (props: ButtonProps) => {
	return (
		<StyledButton
			icon={<PlusOutlined />}
			type='primary'
			shape='circle'
			{...props}
		/>
	)
}

const DeleteButton = (props: ButtonProps) => (
	<StyledButton
		icon={<DeleteOutlined />}
		type='primary'
		shape='circle'
		danger
		{...props}
	/>
)

const SavedButton = (props: ButtonProps) => (
	<StyledButton
		icon={<CheckOutlined />}
		type='primary'
		shape='circle'
		{...props}
	/>
)

const ReloadButton = (props: ButtonProps) => (
	<StyledButton
		icon={<SyncOutlined />}
		type='primary'
		shape='circle'
		{...props}
	/>
)

const FileExportButton = (props: ButtonProps) => (
	<StyledButton icon={<BiExport />} type='primary' shape='circle' {...props} />
)

const EditButton = (props: ButtonProps) => (
	<StyledButton
		icon={<EditOutlined />}
		type='primary'
		shape='circle'
		{...props}
	/>
)

CreateButton.AFFIX_BUTTON_TYPE = 'CREATE_BUTTON'
DeleteButton.AFFIX_BUTTON_TYPE = 'DELETE_BUTTON'
SavedButton.AFFIX_BUTTON_TYPE = 'SAVED_BUTTON'
ReloadButton.AFFIX_BUTTON_TYPE = 'RELOAD_BUTTON'
FileExportButton.AFFIX_BUTTON_TYPE = 'FILE_EXPORT_BUTTON'
EditButton.AFFIX_BUTTON_TYPE = 'EDIT_BUTTON'

export {
	CreateButton,
	DeleteButton,
	SavedButton,
	ReloadButton,
	FileExportButton,
	EditButton,
}
