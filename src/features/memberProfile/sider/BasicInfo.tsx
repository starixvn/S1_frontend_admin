import {
	IGetBasicInfoData,
	ICheckDuplicateNameData,
} from 'features/memberProfile/type'
import {
	Avatar,
	Col,
	Divider,
	Popconfirm,
	Row,
	Space,
	Tag,
	Typography,
	Popover,
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { BsFillImageFill, BsCashStack } from 'react-icons/bs'
import { AiOutlineMail } from 'react-icons/ai'
import { FaLine, FaMobileAlt } from 'react-icons/fa'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useTimeZone } from 'components/TimeZoneSelect'
import moment from 'moment/moment'
import {
	ActStatusEnum,
	identityList,
	statusList,
} from 'features/memberProfile/constants'
import { find } from 'lodash'
import React from 'react'
import { PermissionInterface } from 'type'

const { Title, Text } = Typography

const StyledText = styled(Text)`
	overflow-wrap: anywhere; // 自動換行
`

interface IBasicInfoProps {
	lineUnbindingPermission: PermissionInterface | undefined
	custBasicInfo: IGetBasicInfoData
	checkDuplicateNameList: ICheckDuplicateNameData[]
	onCustPhotoClick: () => void
	onLineUnbind: () => void
	onAccountClick: () => void
}

const StyleIcon = styled.div`
	font-size: 1.3rem;
	line-height: 1;
`

const OnlineTag = styled(Tag)`
	font-size: 15px;
	padding: 3px 10px;
	border-radius: 15px;
`

const BasicInfo = ({
	lineUnbindingPermission,
	custBasicInfo,
	checkDuplicateNameList,
	onCustPhotoClick,
	onLineUnbind,
	onAccountClick,
}: IBasicInfoProps) => {
	const { t } = useTranslation()
	const { timeZoneUtcOffset } = useTimeZone()

	const {
		userName,
		accountName,
		actStatus,
		status,
		depositPointLevel,
		currency,
		identity,
		agentName,
		superiorAffiliateCode,
		registeredTime,
		firstDepositTime,
		lastLoginTime,
		lastActiveTime,
		birthDay,
		birthMonth,
		birthYear,
		mobileNumber,
		email,
		address,
		isLineBinding,
		phoneVerified,
		emailVerified,
		isOnline,
		vipLogo,
		custLineProfile,
		userLang,
		emailVerifyTime,
		phoneVerifyTime,
	} = custBasicInfo ?? {}

	const { userId: lineUserId, createTime: lineBindingTime } =
		custLineProfile ?? {}

	// 辨識 status 狀態
	const getStatusName = () => {
		const statusName = find(
			statusList,
			item => item.value === status
		)?.displayName
		return statusName ? t(statusName) : ''
	}

	const getIdentityName = () => {
		const identityName = find(
			identityList,
			item => item.value === identity
		)?.displayName
		return identityName ? t(identityName) : ''
	}

	return (
		<>
			{/* 使用者頭像與資訊 */}
			<Row gutter={8} align='middle'>
				<Col span={10}>
					<Avatar
						shape='square'
						size={64}
						icon={<UserOutlined />}
						src={vipLogo}
					/>
				</Col>
				<Col span={14}>
					<Space direction='vertical' style={{ padding: '5px' }}>
						<Title level={5}>{userName}</Title>
						<OnlineTag color={isOnline ? 'success' : 'default'}>
							{t('Label_Online')}
						</OnlineTag>
					</Space>
				</Col>
			</Row>
			{/* 各驗證狀態 */}
			<Row style={{ marginTop: '10px' }} justify='space-between'>
				<Col>
					<StyleIcon onClick={onCustPhotoClick}>
						<BsFillImageFill style={{ cursor: 'pointer' }} />
					</StyleIcon>
				</Col>
				<Col>
					{emailVerified ? (
						<Popover
							content={moment(emailVerifyTime)
								.utcOffset(timeZoneUtcOffset)
								.format('YYYY-MM-DD  HH:mm:ss')}
							title={t('Label_EmailVerifiedTime')}
							trigger='hover'
						>
							<StyleIcon>
								<AiOutlineMail color='#FB9C02' />
							</StyleIcon>
						</Popover>
					) : (
						<StyleIcon>
							<AiOutlineMail color='rgba(175,174,175,0.4)' />
						</StyleIcon>
					)}
				</Col>
				<Col>
					{phoneVerified ? (
						<Popover
							content={moment(phoneVerifyTime)
								.utcOffset(timeZoneUtcOffset)
								.format('YYYY-MM-DD  HH:mm:ss')}
							title={t('Label_PhoneVerifiedTime')}
							trigger='hover'
						>
							<StyleIcon>
								<FaMobileAlt color='black' />
							</StyleIcon>
						</Popover>
					) : (
						<StyleIcon>
							<FaMobileAlt color='rgba(175,174,175,0.4)' />
						</StyleIcon>
					)}
				</Col>
				<Col>
					<StyleIcon>
						<BsCashStack
							color={
								actStatus === ActStatusEnum.Active
									? '#5DA416'
									: 'rgba(175,174,175,0.4)'
							}
						/>
					</StyleIcon>
				</Col>
				<Col>
					<Popconfirm
						title={`${t('Label_LineUserId')} : ${lineUserId}`}
						disabled={!isLineBinding}
						cancelText={t('Label_Close')}
						okText={t('Label_Unbind')}
						okButtonProps={{ disabled: !lineUnbindingPermission?.canUse }}
						okType='danger'
						onConfirm={() => onLineUnbind()}
					>
						<StyleIcon
							style={{ cursor: isLineBinding ? 'pointer' : 'default' }}
						>
							<FaLine
								color={isLineBinding ? '#02C755' : 'rgba(175,174,175,0.4)'}
							/>
						</StyleIcon>
					</Popconfirm>
				</Col>
			</Row>
			<Divider style={{ margin: '10px 0' }} />
			{/* Info 內容 */}
			<Space direction='vertical'>
				<Row>
					<StyledText>
						{`${t('Label_FullName')} : ${accountName}`}
						<Typography.Link
							onClick={onAccountClick}
							style={{ marginLeft: 10 }}
						>
							{/* 無資料則不顯示 */}
							{checkDuplicateNameList.length > 0 &&
								checkDuplicateNameList.length}
						</Typography.Link>
					</StyledText>
				</Row>
				<Row>
					<StyledText>{`${t('Label_Status')} : ${getStatusName()}`}</StyledText>
				</Row>
				<Row>
					<StyledText>{`${t(
						'Label_DepositPointLevel'
					)} : ${depositPointLevel}`}</StyledText>
				</Row>
				<Row>
					<StyledText>{`${t('Label_Currency')} : ${currency}`}</StyledText>
				</Row>
				<Row>
					<StyledText>{`${t(
						'Label_PreferLanguages'
					)} : ${userLang}`}</StyledText>
				</Row>
				<Row>
					<StyledText>{`${t(
						'Label_Identity'
					)} : ${getIdentityName()}`}</StyledText>
				</Row>
				<Row>
					<StyledText>{`${t('Label_AgentName')} : ${
						agentName ?? 'N/A'
					}`}</StyledText>
				</Row>
				<Row>
					<StyledText>{`${t('Label_SuperiorAffiliateCode')} : ${
						superiorAffiliateCode ?? 'N/A'
					}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_RegisteredDate'
					)} : ${
						registeredTime
							? `\n${moment(registeredTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD  HH:mm:ss')}`
							: ''
					}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_LineBindingTime'
					)} : ${
						lineBindingTime
							? `\n${moment(lineBindingTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD  HH:mm:ss')}`
							: 'N/A'
					}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_FirstDepositTime'
					)} : ${
						firstDepositTime
							? `\n${moment(firstDepositTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD HH:mm:ss')}`
							: 'N/A'
					}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_LastLogInTime'
					)} : ${
						lastLoginTime
							? `\n${moment(lastLoginTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD HH:mm:ss')}`
							: 'N/A'
					}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_LastActiveTime'
					)} : ${
						lastActiveTime
							? `\n${moment(lastActiveTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD HH:mm:ss')}`
							: 'N/A'
					}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_DOB'
					)} :\n${birthDay}/${birthMonth}/${birthYear}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_PhoneNo'
					)} :\n${mobileNumber}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_Email'
					)} :\n${email}`}</StyledText>
				</Row>
				<Row>
					<StyledText style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_Address'
					)} :\n${address}`}</StyledText>
				</Row>
			</Space>
		</>
	)
}

export { BasicInfo }
