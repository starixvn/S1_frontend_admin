import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	SyncOutlined,
} from '@ant-design/icons'
import { ButtonProps } from 'antd'
import { BiExport, BiAddToQueue, BiSortAlt2 } from 'react-icons/bi'
import { BsX } from 'react-icons/bs'
import StyledButton from './StyledButton'

const CreateButton = (props: ButtonProps) => (
	<StyledButton
		icon={<PlusOutlined />}
		type='primary'
		shape='circle'
		{...props}
	/>
)

const RejectButton = (props: ButtonProps) => (
	<StyledButton
		icon={<BsX style={{ fontSize: 24 }} />}
		type='primary'
		shape='circle'
		danger
		{...props}
	/>
)

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
	<StyledButton
		icon={<BiExport style={{ fontSize: 18 }} />}
		type='primary'
		shape='circle'
		{...props}
	/>
)

const EditButton = (props: ButtonProps) => (
	<StyledButton
		icon={<EditOutlined />}
		type='primary'
		shape='circle'
		{...props}
	/>
)

const AddBatchButton = (props: ButtonProps) => (
	<StyledButton
		icon={<BiAddToQueue style={{ fontSize: 16 }} />}
		type='primary'
		shape='circle'
		{...props}
	/>
)

const DragButton = (props: ButtonProps) => (
	<StyledButton
		icon={<BiSortAlt2 style={{ fontSize: 18 }} />}
		type='primary'
		shape='circle'
		{...props}
	/>
)

const CloseButton = (props: ButtonProps) => (
	<StyledButton
		icon={<CloseOutlined />}
		type='primary'
		danger
		shape='circle'
		{...props}
	/>
)

CreateButton.AFFIX_BUTTON_TYPE = 'CREATE_BUTTON'
RejectButton.AFFIX_BUTTON_TYPE = 'REJECT_BUTTON'
DeleteButton.AFFIX_BUTTON_TYPE = 'DELETE_BUTTON'
SavedButton.AFFIX_BUTTON_TYPE = 'SAVED_BUTTON'
ReloadButton.AFFIX_BUTTON_TYPE = 'RELOAD_BUTTON'
FileExportButton.AFFIX_BUTTON_TYPE = 'FILE_EXPORT_BUTTON'
EditButton.AFFIX_BUTTON_TYPE = 'EDIT_BUTTON'
AddBatchButton.AFFIX_BUTTON_TYPE = 'ADD_BATCH_BUTTON'
DragButton.AFFIX_BUTTON_TYPE = 'DRAG_BUTTON'
CloseButton.AFFIX_BUTTON_TYPE = 'CLOSE_BUTTON'

export {
	CreateButton,
	RejectButton,
	DeleteButton,
	SavedButton,
	ReloadButton,
	FileExportButton,
	EditButton,
	AddBatchButton,
	DragButton,
	CloseButton,
}
