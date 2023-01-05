export interface IGetTagArgs {
	pageNumber: number
	pageSize: number
	status: number
}

export interface IEditBefore {
	id: number
	tagName: string
	tagColour: string
	description: string
}

export interface IEditAfter {
	id: number
	tagName: string
	tagColour: string
	description: string
}

export interface IEditTagArgs {
	before: IEditBefore
	after: IEditAfter
}

export interface ICreateTagArgs {
	after: {
		tagName: string
		tagColour: string
		status?: number
		description: string
	}
}

export interface IStatusBefore {
	id?: number
	status?: number
}

export interface IStatusAfter {
	id?: number
	status?: number
}

export interface ISetTagStatus {
	before: IStatusBefore
	after: IStatusAfter
}

export interface IGetTagListData {
	id: number
	tagName: string
	tagColour: string
	status: number
	description: string
	creator: null | string
	updateTime: string
	updator: string
}

export interface IEditForm {
	tagName: string
	tagColour: string
	status?: number
	description: string
}

export interface IFilterForm {
	status: number
}

export interface ICreateForm {
	tagName: string
	tagColour: string
	description: string
}
