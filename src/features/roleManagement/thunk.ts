import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	fetchPermissionAddRolePermission,
	fetchPermissionDeleteRolePermission,
	fetchPermissionGetAddRolePermission,
	fetchPermissionGetRoleList,
	fetchPermissionGetUpdateRolePermission,
} from './api'
import { AddRolePermissionInterface } from './type'

export const fetchPermissionGetRoleListAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetRoleList',
	async (roleName: string = '') => {
		const data = await fetchPermissionGetRoleList(roleName)

		return data
	}
)

export const fetchPermissionGetAddRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetAddRolePermission',
	async () => {
		const data = await fetchPermissionGetAddRolePermission()

		return data
	}
)

export const fetchPermissionAddRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionAddRolePermission',
	async (body: AddRolePermissionInterface) => {
		await fetchPermissionAddRolePermission(body)
	}
)

export const fetchPermissionDeleteRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionDeleteRolePermission',
	async (role: number) => {
		const deleteRole = await fetchPermissionDeleteRolePermission(role)

		return deleteRole
	}
)

export const fetchPermissionGetUpdateRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetUpdateRolePermissionAsync',
	async (role: number) => {
		const data = await fetchPermissionGetUpdateRolePermission(role)

		return data
	}
)
