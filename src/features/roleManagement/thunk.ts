import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	AddRolePermissionInterface,
	fetchPermissionAddRolePermission,
	fetchPermissionGetAllRolePermission,
	fetchPermissionGetRoleList,
} from './api'

export const fetchPermissionGetRoleListAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetRoleList',
	async (roleName: string = '') => {
		const data = await fetchPermissionGetRoleList(roleName)

		return data
	}
)

export const fetchPermissionGetAllRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetAllRolePermission',
	async () => {
		const data = await fetchPermissionGetAllRolePermission()

		return data
	}
)

export const fetchPermissionAddRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionAddRolePermission',
	async (body: AddRolePermissionInterface) => {
		await fetchPermissionAddRolePermission(body)
	}
)
