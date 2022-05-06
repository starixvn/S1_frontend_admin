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
	async ({ roleName, siteId }: { roleName: string; siteId?: number }) => {
		const data = await fetchPermissionGetRoleList({
			roleName,
			siteId,
		})

		return data
	}
)

export const fetchPermissionGetAddRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetAddRolePermission',
	async ({ siteId }: { siteId?: number }) => {
		const data = await fetchPermissionGetAddRolePermission({
			siteId,
		})

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
	async ({ role, siteId }: { role: number; siteId?: number }) => {
		const deleteRole = await fetchPermissionDeleteRolePermission({
			role,
			siteId,
		})

		return deleteRole
	}
)

export const fetchPermissionGetUpdateRolePermissionAsync = createAsyncThunk(
	'roleManagement/fetchPermissionGetUpdateRolePermissionAsync',
	async ({ role, siteId }: { role: number; siteId?: number }) => {
		const data = await fetchPermissionGetUpdateRolePermission({
			role,
			siteId,
		})

		return data
	}
)
