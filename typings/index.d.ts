export interface BackgroundMessage<T = any> {
	action: "isContentScriptInjected" | "getAnswers"
	data?: T
}

export interface APIAnswer {
	Id: number
	Text: string
	CreationDate: string
	NegativeEvaluationCount: number
	PositiveEvaluationCount: number
	IsPremium: any
	User: {
		Id: number
		Alias: string
		ImageUrl: string
		Name: string
		FullName: string
		IsVerified: string
	}
}

export interface APIAnswersResponse {
	answers: APIAnswer[]
}
