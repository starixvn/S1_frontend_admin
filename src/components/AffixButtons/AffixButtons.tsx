/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import { Affix } from 'antd'
import { CSSProperties, FC, ReactNode } from 'react'
import toArray from 'rc-util/lib/Children/toArray'
import devWarning from 'components/_utils/defWarning'
import {
	CreateButton,
	DeleteButton,
	SavedButton,
	ReloadButton,
	FileExportButton,
	EditButton,
	AddBatchButton,
	DragButton,
	CloseButton,
} from './ActionButtons'
import GoNextRouteButton from './GoNextRouteButton'
import GoBackRouteButton from './GoBackRouteButton'
import BackToTopButton from './BackToTopButton'
import { BUTTON_HEIGHT } from './StyledButton'

export const AFFIX_BUTTON_TYPE_ENUM = {
	BACK_TO_TOP_BUTTON: 'BACK_TO_TOP_BUTTON',
	CREATE_BUTTON: 'CREATE_BUTTON',
	DELETE_BUTTON: 'DELETE_BUTTON',
	SAVED_BUTTON: 'SAVED_BUTTON',
	RELOAD_BUTTON: 'RELOAD_BUTTON',
	FILE_EXPORT_BUTTON: 'FILE_EXPORT_BUTTON',
	GO_BACK_ROUTE_BUTTON: 'GO_BACK_ROUTE_BUTTON',
	GO_NEXT_ROUTE_BUTTON: 'GO_NEXT_ROUTE_BUTTON',
	EDIT_BUTTON: 'EDIT_BUTTON',
	ADD_BATCH_BUTTON: 'ADD_BATCH_BUTTON',
	DRAG_BUTTON: 'DRAG_BUTTON',
	CLOSE_BUTTON: 'CLOSE_BUTTON',
}

const { GO_BACK_ROUTE_BUTTON, GO_NEXT_ROUTE_BUTTON } = AFFIX_BUTTON_TYPE_ENUM

const buttonTypeValidator = (buttonType: any) => {
	const valid = Object.values(AFFIX_BUTTON_TYPE_ENUM).some(
		type => type === buttonType
	)

	devWarning(
		valid,
		'AffixButtons',
		"Only accepts AffixButtons.BackToTop and Breadcrumb.Create and Breadcrumb.Delete and Breadcrumb.Reload  as it's children"
	)

	return valid
}

const getAffixBottomToTopStyle = (index: number): CSSProperties => {
	return {
		position: 'fixed',
		bottom: 12,
		right: (BUTTON_HEIGHT + 8) * (index + 1) + 12,
		zIndex: 2,
	}
}

const getAffixButtonStyle = (index: number): CSSProperties => {
	return {
		position: 'fixed',
		bottom: (BUTTON_HEIGHT + 8) * index + 12,
		right: 12,
		zIndex: 2,
	}
}

interface AffixButtonsInterface extends FC<{ children: ReactNode }> {
	BackToTop: typeof BackToTopButton
	Create: typeof CreateButton
	Delete: typeof DeleteButton
	Saved: typeof SavedButton
	Reload: typeof ReloadButton
	FileExport: typeof FileExportButton
	GoBackRoute: typeof GoBackRouteButton
	GoNextRoute: typeof GoNextRouteButton
	Edit: typeof EditButton
	AddBatch: typeof AddBatchButton
	Drag: typeof DragButton
	Close: typeof CloseButton
}

const AffixButtons: AffixButtonsInterface = props => {
	if (!props?.children) return null

	const elementArray = toArray(props?.children)

	const renderRouteActionButtons = () => {
		return elementArray
			.filter(
				(element: any) =>
					[GO_BACK_ROUTE_BUTTON, GO_NEXT_ROUTE_BUTTON].some(
						type => type === element?.type?.AFFIX_BUTTON_TYPE
					) && Boolean
			)
			.map((element: any, index) => (
				<Affix key={index} style={getAffixBottomToTopStyle(index)}>
					{element}
				</Affix>
			))
	}

	const renderButtons = () => {
		return elementArray
			.filter((element: any) => {
				const valid = buttonTypeValidator(element?.type?.AFFIX_BUTTON_TYPE)

				return (
					valid &&
					[GO_BACK_ROUTE_BUTTON, GO_NEXT_ROUTE_BUTTON].every(
						type => type !== element?.type?.AFFIX_BUTTON_TYPE
					)
				)
			})
			.reverse()
			.map((element: any, index) => (
				<Affix key={index} style={getAffixButtonStyle(index)}>
					{element}
				</Affix>
			))
	}

	return (
		<>
			{renderButtons()}
			{renderRouteActionButtons()}
		</>
	)
}

AffixButtons.Create = CreateButton
AffixButtons.Delete = DeleteButton
AffixButtons.Saved = SavedButton
AffixButtons.Reload = ReloadButton
AffixButtons.FileExport = FileExportButton
AffixButtons.BackToTop = BackToTopButton
AffixButtons.GoBackRoute = GoBackRouteButton
AffixButtons.GoNextRoute = GoNextRouteButton
AffixButtons.Edit = EditButton
AffixButtons.AddBatch = AddBatchButton
AffixButtons.Drag = DragButton
AffixButtons.Close = CloseButton

export { AffixButtons }
