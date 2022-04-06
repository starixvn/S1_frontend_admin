export interface LocationState {
	state: {
		from: {
			pathname: string
		}
	}
}

export interface UserMenuState {
	childs: null | Array<UserMenuState>
	funcKey: string
}

export interface UserAllowedRole {
	funcKey: string
	isView: boolean
	isEdit: boolean
}
