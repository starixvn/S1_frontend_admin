import { BasicInfo } from 'features/memberProfile/sider/BasicInfo'
import { Divider, message, Spin } from 'antd'
import { StatusInfo } from 'features/memberProfile/sider/StatusInfo'
import { AffiliateInfo } from 'features/memberProfile/sider/AffiliateInfo'
import { useParams } from 'react-router-dom'
import DocumentTitle from 'react-document-title'
import {
	IGetBasicInfoResponse,
	IGetCustPhotoResponse,
	IGetCheckDuplicateNameResponse,
} from 'features/memberProfile/type'
import {
	useDeleteCustPhotoMutation,
	useGetBasicInfoQuery,
	useGetCustPhotoQuery,
	useLineUnbindMutation,
	useUploadCustPhotoMutation,
	useGetCheckDuplicateNameQuery,
} from 'features/memberProfile/api'
import { UploadPicModal } from 'features/memberProfile/sider/uploaderModal/UploadPicModal'
import { useAuth, useModal } from 'common/hooks'
import { useTranslation } from 'react-i18next'
import { UploadFile } from 'antd/es/upload/interface'
import { RcFile } from 'antd/es/upload'
import { PAGE_TITLE } from 'app/config'
import { UserListModal } from 'features/memberProfile/pages/customerInfo/components/UserListModal'

const MemberProfileSiderContent = () => {
	const { t } = useTranslation()
	const { actionPermissions: { lineUnbindingPermission } = {} } = useAuth()
	const { custId = '' } = useParams()
	const uploadModal = useModal()
	const ipUserListModal = useModal()
	const {
		data: { data: custBasicInfo } = {} as IGetBasicInfoResponse,
		isFetching: isGetCustBasicInfoLoading,
	} = useGetBasicInfoQuery({
		custId: Number(custId),
	})

	const { accountName: checkAccountName } = custBasicInfo ?? {}

	const {
		data: { data: custPhotoList = [] } = {} as IGetCustPhotoResponse,
		isFetching: isGetCustPhotoListFetching,
	} = useGetCustPhotoQuery({ custId: Number(custId) })

	const {
		data: {
			data: checkDuplicateNameList = [],
		} = {} as IGetCheckDuplicateNameResponse,
		isFetching: isGetCheckDuplicateNameListFetching,
	} = useGetCheckDuplicateNameQuery(
		{
			custId: Number(custId),
			fullName: checkAccountName,
		},
		{
			skip: !checkAccountName,
			refetchOnMountOrArgChange: true,
		}
	)

	const [uploadCustPhoto, { isLoading: isUploadCustPhotoLoading }] =
		useUploadCustPhotoMutation()

	const [deleteCustPhoto, { isLoading: isDeleteCustPhotoLoading }] =
		useDeleteCustPhotoMutation()

	const [lineUnbind] = useLineUnbindMutation()

	const handleDeleteCustPhoto = async (id: number) => {
		try {
			await deleteCustPhoto({ custId: Number(custId), id }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleUploadCustPhoto = async (file: UploadFile) => {
		const formData = new FormData()
		formData.append('Photo', file.originFileObj as RcFile)
		formData.append('custId', custId)
		try {
			await uploadCustPhoto(formData).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleLineUnbind = async () => {
		if (!custId) return
		try {
			await lineUnbind({ custId: Number(custId) }).unwrap()
			message.success(t('System.Label_Success'))
		} catch (error) {
			message.error(
				(error as Error)?.message || t('System.Label_NotExpectedServerError')
			)
		}
	}

	const handleAccountClick = () => {
		ipUserListModal.onOpen()
	}

	return (
		<DocumentTitle title={custBasicInfo?.userName || PAGE_TITLE}>
			<Spin spinning={isGetCustBasicInfoLoading}>
				<BasicInfo
					lineUnbindingPermission={lineUnbindingPermission}
					custBasicInfo={custBasicInfo}
					checkDuplicateNameList={checkDuplicateNameList}
					onCustPhotoClick={() => uploadModal.onOpen()}
					onAccountClick={handleAccountClick}
					onLineUnbind={handleLineUnbind}
				/>
				<Divider style={{ margin: '15px 0' }} />
				<StatusInfo custBasicInfo={custBasicInfo} />
				<Divider />
				{custBasicInfo?.affInfo && (
					<>
						<AffiliateInfo affInfo={custBasicInfo?.affInfo} />
						<Divider />
					</>
				)}

				<UploadPicModal
					isKyc={custBasicInfo?.isKyc}
					deleteLoading={isDeleteCustPhotoLoading}
					custPhotoListLoading={isGetCustPhotoListFetching}
					visible={uploadModal.visible}
					onCancel={uploadModal.onCancel}
					custPhotoList={custPhotoList ?? []}
					onDeletePhoto={handleDeleteCustPhoto}
					onUploadPhoto={handleUploadCustPhoto}
					uploading={isUploadCustPhotoLoading}
				/>

				<UserListModal
					loading={isGetCheckDuplicateNameListFetching}
					userList={checkDuplicateNameList}
					visible={ipUserListModal.visible}
					onCancel={ipUserListModal.onCancel}
					clearCache={false}
				/>
			</Spin>
		</DocumentTitle>
	)
}

export default MemberProfileSiderContent
