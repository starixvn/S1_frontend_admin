import { FC, useEffect, useState } from 'react'
import { LayoutContent } from 'app/pages/layout'
import { AffixButtons } from 'components/AffixButtons'
import { SnsManagementFilter } from 'features/snsManagement/components/SnsManagementFilter'
import { Form, message } from 'antd'
import { useAppSelector } from 'app/store'
import { selectCurrencyListBySite, selectUserSite } from 'common/enum'
import { useTimeZone } from 'components/TimeZoneSelect'
import { SnsManagementTab } from 'features/snsManagement/components/SnsManagementTab'
import {
	useLazyGetDataListQuery,
	useSetDataMutation,
	useSetSortMutation,
} from 'features/snsManagement/api'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'common/hooks'
import { ISNSData } from 'features/snsManagement/type'
import { tableContext } from 'features/snsManagement/tableContext'

const SnsManagement: FC<{
	pageTitle?: string
}> = ({ pageTitle }) => {
	const { t } = useTranslation()
	const { siteId } = useAppSelector(selectUserSite) ?? {}
	const { actionPermissions: { editPermission } = {} } = useAuth()
	const [filterForm] = Form.useForm()
	const [tableForm] = Form.useForm()
	const currencyListBySite = useAppSelector(selectCurrencyListBySite)
	const { timeZoneUtcOffset } = useTimeZone()
	const currencyId = Form.useWatch('currencyId', filterForm)

	// 用來記錄當前 所選的語系給 setSort 使用
	const [currentLang, setCurrentLang] = useState<string | undefined>(undefined)
	// 當前所顯示的table 資料，因為setSort需要使用，所以寫在這
	const [tableSource, setTableSource] = useState<ISNSData[]>([])
	const [editingKey, setEditingKey] = useState<undefined | number>(undefined)
	const [isSortMode, setIsSortMode] = useState(false)
	// handleSortMode Canceled State
	const [sortModeCanceled, setSortModeCanceled] = useState(false)
	// 監聽是否為editingMode
	const [isEditMode, setEditMode] = useState(false)
	const toggleSortMode = () => {
		setIsSortMode(prev => !prev)
	}
	const [langCodes, setLangCodes] = useState<string[]>([])
	// 因為 langCodes來自於 search getData api 的 response , 故需要手動設置一個 loading 狀態，這樣首次更新才會正常吃到 langCode
	const [isLangCodeLoading, setLangCodesLoading] = useState<boolean>(false)

	const [
		getDataList,
		{
			data: { data: snsManagementData = {} } = {},
			isFetching: isGetDataListLoading,
		},
	] = useLazyGetDataListQuery()

	const [setData, { isLoading: isSetDataLoading }] = useSetDataMutation()

	const [setSort, { isLoading: isSetSortLoading }] = useSetSortMutation()

	const handleSearch = async () => {
		try {
			setLangCodesLoading(true)
			const { data: rawData } = await getDataList({
				siteId,
				currencyId,
			}).unwrap()
			// 透過 api data 先把 keys map 出來當作 langCodes 做使用
			setLangCodes(Object.keys(rawData))
			setLangCodesLoading(false)
		} catch (error) {
			message.error(t((error as Error).message))
		}
	}

	const handleRowSaved = async (record: ISNSData) => {
		const { id, channelName } = record
		const {
			title,
			mainPageStatus,
			contactPageStatus,
			footerStatus,
			appPageStatus,
			linkType,
			link,
			iosLink = '',
			androidLink,
		} = await tableForm.validateFields()
		try {
			await setData({
				id,
				title,
				mainPageStatus,
				contactPageStatus,
				footerStatus,
				appPageStatus,
				link,
				iosLink,
				androidLink,
				channelName,
				linkType,
			}).unwrap()
			message.success(t('System.Label_Success'))
			setEditingKey(undefined)
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
		setEditMode(false)
	}

	const handleSortModeCanceled = () => {
		// dataSource 的初始資料依據 lang 不同獨立存在於 table 內 ,這裡用 state 廣播狀態 ,
		// 使 table 監聽到 cancel 後reset DataSource
		setSortModeCanceled(true)
		setTimeout(() => setSortModeCanceled(false), 0)
	}

	const handleSetSort = async () => {
		if (!currentLang || !currencyId || tableSource.length === 0) return

		const sortIds = tableSource.map(item => item.id)
		try {
			await setSort({
				siteId,
				currencyId,
				langId: currentLang,
				sortIds,
			}).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
		toggleSortMode()
	}

	useEffect(() => {
		// init search , 每次切換 currency 做 search
		if (currencyId) {
			handleSearch()
		}
	}, [currencyId])

	const loading = isGetDataListLoading || isSetDataLoading || isSetSortLoading

	// editing or sorting disabled components
	const disabled = isEditMode || isSortMode

	return (
		<LayoutContent.Main>
			<LayoutContent.Title title={pageTitle ?? ''} />
			<SnsManagementFilter
				form={filterForm}
				currencyListBySite={currencyListBySite}
				disabled={disabled}
			/>
			{/* 只有跨層級的 資源用context 傳送 */}
			<tableContext.Provider
				value={{
					loading,
					timeZoneUtcOffset,
					editingKey,
					setEditingKey,
					editPermission,
					handleRowSaved,
					isSortMode,
					sortModeCanceled,
					tableSource,
					setTableSource,
					disabled,
					setEditMode,
				}}
			>
				<SnsManagementTab
					langCode={langCodes}
					isLangCodeLoading={isLangCodeLoading}
					snsManagementData={snsManagementData}
					form={tableForm}
					setCurrentLang={setCurrentLang}
					currentLang={currentLang}
				/>
			</tableContext.Provider>

			<AffixButtons>
				<AffixButtons.BackToTop />
				{isSortMode ? (
					<>
						<AffixButtons.Close
							onClick={() => {
								handleSortModeCanceled()
								toggleSortMode()
							}}
						/>
						<AffixButtons.Saved loading={loading} onClick={handleSetSort} />
					</>
				) : (
					<AffixButtons.Drag
						onClick={toggleSortMode}
						disabled={!editPermission?.canUse || disabled}
					/>
				)}
			</AffixButtons>
		</LayoutContent.Main>
	)
}

export default SnsManagement
