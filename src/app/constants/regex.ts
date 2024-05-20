export const USERNAME_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{6,18}$/

export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{6,15}$/

// Full Name (Real Name)格式要求，不可含有特殊字元如：:＊*，,。．；;
export const FULLNAME_REGEX =
	/^[\p{L}. \p{Script=Han}\p{Script=Hangul}\p{Script=Thai}\p{Script=Bengali}\p{Script=Devanagari}\p{Script=Latin}\p{Script=Cyrillic}\p{Script=Khmer}\p{Script=Hiragana}\p{Script=Katakana}]+$/u
