export const headerManagementTour = [
	{
		selector: 'filter-panel',
		title: 'Label_HeaderManagement_Tour_FilterSection_Title',
		description: 'Label_HeaderManagement_Tour_FilterSection_Description',
		cover: null,
	},
	{
		selector: 'filter-currency',
		title: 'Label_HeaderManagement_Tour_Currency_Title',
		description: 'Label_HeaderManagement_Tour_Currency_Description',
		cover: null,
	},
	{
		selector: 'filter-category',
		title: 'Label_HeaderManagement_Tour_LobbyCategory_Title',
		description: 'Label_HeaderManagement_Tour_LobbyCategory_Description',
		cover: null,
	},
	{
		selector: 'search-button',
		title: 'Label_HeaderManagement_Tour_Search_Title',
		description: 'Label_HeaderManagement_Tour_Search_Description',
		cover: null,
	},
	{
		selector: 'result-table',
		title: 'Label_HeaderManagement_Tour_FilterResultsTable_Title',
		description: 'Label_HeaderManagement_Tour_FilterResultsTable_Description',
		cover: null,
	},
	{
		selector: 'floating-button',
		title: 'Label_HeaderManagement_Tour_Sorting_Title',
		description: 'Label_HeaderManagement_Tour_Sorting_Description',
		cover: 'https://i.imgur.com/h14Bsd3.gif',
	},
	{
		selector: 'status-button',
		title: 'Label_HeaderManagement_Tour_ProductStatus_Title',
		description: 'Label_HeaderManagement_Tour_ProductStatus_Description',
		cover: null,
	},
	{
		selector: 'status-modal',
		title: 'Label_HeaderManagement_Tour_StatusModal_Title',
		description: 'Label_HeaderManagement_Tour_StatusModal_Description',
		cover: null,
	},
	{
		selector: 'status-table',
		title: 'Label_HeaderManagement_Tour_StatusTable_Title',
		description: 'Label_HeaderManagement_Tour_StatusTable_Description',
		cover: null,
	},
]

// step for handling the certain logic of this tour
export enum HeaderManagementStepEnum {
	AboutHandleSearch = 4,
	AboutHandleProductStatus = 7,
}
