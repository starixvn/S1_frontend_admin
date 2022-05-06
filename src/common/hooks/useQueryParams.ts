import { useAppSelector } from 'app/store'
import { selectUserSite } from 'common/enum'
import _ from 'lodash'
import { useSearchParams } from 'react-router-dom'

export const buildParams = (values: object) => {
	const params = new URLSearchParams()

	Object.entries(values).forEach(
		([key, value]: [string, string | string[] | number[]]) => {
			if (!value || value?.length === 0) return

			if (Array.isArray(value)) {
				params.append(key, `${value.join(',')}[]`)
			} else {
				params.append(key, value)
			}
		}
	)

	const queryParams = Object.fromEntries(params)

	return queryParams
}

const readParams = (searchParams: URLSearchParams) => {
	const params: any = {}
	const originParams = Object.fromEntries(searchParams)

	Object.keys(originParams).forEach((key: string) => {
		const value = originParams[key]

		if (_.endsWith(value, '[]')) {
			params[key] = _.replace(value, '[]', '').split(',').filter(Boolean)
		} else {
			params[key] = value ?? ''
		}
	})

	return params
}

const useQueryParams = (): [
	{
		[k: string]: any
	},
	(values: object) => void
] => {
	const [searchParams, setSearchParams] = useSearchParams()
	const userSite = useAppSelector(selectUserSite)
	const queryParams = readParams(searchParams)

	const setQueryParams = (values: object) => {
		if (values) {
			setSearchParams(buildParams({ ...values, siteId: userSite?.siteId }))
		}
	}
	return [queryParams, setQueryParams]
}

export { useQueryParams }
