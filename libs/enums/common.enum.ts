export enum Message {
	SOMETHING_WENT_WRONG = 'SOMETHING WENT WRONG!',
	NO_DATA_FOUND = 'NO DATA FOUND!',
	CREATE_FAILED = 'CREATE FAILED!',
	UPDATE_FAILED = 'UPDATE FAILED!',
	REMOVE_FAILED = 'REMOVE FAILED!',
	USED_NICK_PHONE = 'YOU ARE INSERTING ALREADY USED NICK OR PHONE!',
	TOKEN_CREATION_FAILED = 'TOKEN CREATION ERROR!',
	NO_MEMBER_NICK = 'NO MEMBER WITH THAT MEMBER NICK!',
	BLOCKED_USER = 'YOU HAVE BEEN BLOCKED!',
	WRONG_PASSWORD = 'WRONG PASSWORD, TRY AGAIN!',
	NOT_AUTHENTICATED = 'PLEASE LOGIN FIRST!',
	TOKEN_NOT_EXIST = 'BEARER TOKEN IS NOT PROVIDED!',
	ONLY_SPECIFIC_ROLES_ALLOWED = 'ALLOWED ONLY FOR MEMBERS WITH SPECIFIC ROLES!',
	NOT_ALLOWED_REQUEST = 'NOT ALLOWED REQUEST!',
	INSERT_ALL_INPUTS = 'PLEASE PROVIDE ALL INPUTS',
	GENERIC_ERROR_MESSAGE = 'GENERIC_ERROR_MESSAGE',
}

export enum Direction {
	ASC = 'ASC',
	DESC = 'DESC',
}
