import { IGetBasicInfoData } from 'features/memberProfile/type'
import { Avatar, Col, Divider, Row, Space, Tag, Typography } from 'antd'
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

interface IBasicInfoProps {
	custBasicInfo: IGetBasicInfoData
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

const BasicInfo = ({ custBasicInfo }: IBasicInfoProps) => {
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
		affiliatesName,
		affiliatesCode,
		registeredTime,
		lineBindingTime,
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
	} = custBasicInfo ?? {}

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
					<Avatar shape='square' size={64} icon={<UserOutlined />} />
				</Col>
				<Col span={14}>
					<Space direction='vertical' style={{ padding: '5px' }}>
						<Typography.Title level={5}>{userName}</Typography.Title>
						<OnlineTag color={isOnline ? 'success' : 'default'}>
							{t('Label_Online')}
						</OnlineTag>
					</Space>
				</Col>
			</Row>
			{/* 各驗證狀態 */}
			<Row style={{ marginTop: '10px' }} justify='space-between'>
				<Col>
					<StyleIcon>
						<BsFillImageFill />
					</StyleIcon>
				</Col>
				<Col>
					<StyleIcon>
						<AiOutlineMail
							color={emailVerified ? '#FB9C02' : 'rgba(175,174,175,0.4)'}
						/>
					</StyleIcon>
				</Col>
				<Col>
					<StyleIcon>
						<FaMobileAlt
							color={phoneVerified ? 'black' : 'rgba(175,174,175,0.4)'}
						/>
					</StyleIcon>
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
					<StyleIcon>
						<FaLine
							color={isLineBinding ? '#02C755' : 'rgba(175,174,175,0.4)'}
						/>
					</StyleIcon>
				</Col>
			</Row>
			<Divider style={{ margin: '10px 0' }} />
			{/* Info 內容 */}
			<Space direction='vertical'>
				<Row>
					<Typography.Text>{`${t(
						'Label_FullName'
					)} : ${accountName}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text>{`${t(
						'Label_Status'
					)} : ${getStatusName()}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text>{`${t(
						'Label_DepositPointLevel'
					)} : ${depositPointLevel}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text>{`${t(
						'Label_Currency'
					)} : ${currency}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text>{`${t(
						'Label_Identity'
					)} : ${getIdentityName()}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text>{`${t('Label_AffiliatesName')} : ${
						affiliatesName ?? 'N/A'
					}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text>{`${t('Label_AffiliatesCode')} : ${
						affiliatesCode ?? 'N/A'
					}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_RegisteredDate'
					)} : ${
						registeredTime
							? `\n${moment(registeredTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD  HH:mm:ss')}`
							: ''
					}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_LineBindingTime'
					)} : ${
						lineBindingTime
							? `\n${moment(lineBindingTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD  HH:mm:ss')}`
							: 'N/A'
					}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_FirstDepositTime'
					)} : ${
						firstDepositTime
							? `\n${moment(firstDepositTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD HH:mm:ss')}`
							: 'N/A'
					}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_LastLogInTime'
					)} : ${
						lastLoginTime
							? `\n${moment(lastLoginTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD HH:mm:ss')}`
							: 'N/A'
					}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_LastActiveTime'
					)} : ${
						lastActiveTime
							? `\n${moment(lastActiveTime)
									.utcOffset(timeZoneUtcOffset)
									.format('YYYY-MM-DD HH:mm:ss')}`
							: 'N/A'
					}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_DOB'
					)} :\n${birthDay}/${birthMonth}/${birthYear}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_PhoneNo'
					)} :\n${mobileNumber}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_Email'
					)} :\n${email}`}</Typography.Text>
				</Row>
				<Row>
					<Typography.Text style={{ whiteSpace: 'pre-wrap' }}>{`${t(
						'Label_Address'
					)} :\n${address}`}</Typography.Text>
				</Row>
			</Space>
		</>
	)
}

export { BasicInfo }
