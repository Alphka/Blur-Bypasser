interface BackgroundMessage {
	action: "isContentScriptInjected" | "getAnswers"
	data?: any
}

interface APIAnswersResponse {
	answers: {
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
	}[]
}
