import { APIAnswersResponse, BackgroundMessage } from "../typings"

function RemoveCookie(key: string){
	document.cookie = `${key}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=.passeidireto.com; Path=/`
}

new class ContentScript {
	answers!: Awaited<ReturnType<typeof this.GetAnswers>>
	main!: HTMLElementTagNameMap["main"]
	mainPromise!: Promise<typeof this.main>
	type!: string
	id!: string
	isDocumentObserver = false
	isQuestionObserver = false
	observers = new Map<number, MutationObserver>()

	constructor(){
		if(document.documentElement.dataset.pdBypass) throw new Error("Script injected multiple times")

		document.documentElement.dataset.pdBypass = "true"

		this.Init()
	}
	async Init(){
		this.mainPromise = new Promise<typeof this.main>(resolve => {
			new MutationObserver((mutations, observer) => {
				for(const { target, addedNodes } of mutations){
					if(!(target as HTMLElement).classList?.contains("application--wrap")) continue

					for(const element of addedNodes){
						if((element as HTMLElement).tagName === "MAIN"){
							resolve(element as typeof this.main)
							observer.disconnect()
							return
						}
					}
				}
			}).observe(document.body, {
				subtree: true,
				childList: true
			})
		})

		this.AddExtensionListeners()
		this.LoadExtension()

		const main = this.main = await this.mainPromise

		let loaded = false

		// Reload on page change
		new MutationObserver(mutations => {
			for(const { addedNodes, removedNodes } of mutations){
				for(const element of addedNodes){
					if((element as HTMLElement).className === "mv-viewer-layout"){
						console.log("Page changed. Reloading extension")
						this.LoadExtension()
						return
					}

					if((element as HTMLElement).className === "mv-file mv-content"){
						if(this.isQuestionObserver) this.RemoveObservers()
						if(!this.isDocumentObserver){
							console.log("Document opened. Setting blur observer")
							this.LoadExtension()
						}

						return
					}
				}

				for(const element of removedNodes){
					if((element as HTMLElement).className === "mv-file mv-content"){
						console.log("Document closed or changed. Removing blur observer")
						this.RemoveObservers()
						this.LoadExtension()
						return
					}

					if((element as HTMLElement).className === "mv-viewer-layout"){
						console.log("Page changed. Removing blur observer")
						this.RemoveObservers()
						this.LoadExtension()
						return
					}
				}
			}
		}).observe(main, {
			childList: true,
			subtree: true
		})
	}
	SetPageData(){
		const [type, id] = location.pathname.substring(1).split("/", 2)

		this.type = type
		this.id = id
	}
	LoadExtension(){
		this.SetPageData()

		for(const key of Object.keys(localStorage)){
			if(
				key.startsWith("fileViewer_lastPage_") ||
				key.startsWith("pd_materialViewedPagesCount_")
			) localStorage.removeItem(key)
		}

		RemoveCookie("first_accessed_page")
		RemoveCookie("first_accessed_page_referer")
		RemoveCookie("last-session-tracking-id_1")
		RemoveCookie("last-session-tracking-call_1")

		switch(this.type){
			case "arquivo": return this.SetDocumentObserver()
			case "pergunta": return this.SetQuestionObserver()
		}
	}
	RemoveObservers(){
		for(const [id, observer] of this.observers.entries()){
			observer.disconnect()
			this.observers.delete(id)
		}

		this.isDocumentObserver = false
		this.isQuestionObserver = false
	}
	async SetDocumentObserver(){
		if(this.isDocumentObserver) return console.log("Already observing")
		if(this.observers.size) console.warn("There were active observers")

		this.isDocumentObserver = true

		let observerId = 0

		const fileContainer = await new Promise<HTMLDivElement>(resolve => {
			const observer = new MutationObserver((mutations, observer) => {
				for(const { addedNodes } of mutations){
					for(const node of addedNodes){
						if((node as HTMLElement).classList?.contains("mv-file-container")){
							observer.disconnect()
							this.observers.delete(observerId++)
							resolve(node as HTMLDivElement)
							return
						}
					}
				}
			})

			observer.observe(document.body, {
				childList: true,
				subtree: true
			})

			this.observers.set(observerId, observer)
		})

		const fileViewer = document.body.querySelector<HTMLDivElement>("#file-viewer")!

		await new Promise<void>(resolve => {
			const observer = new MutationObserver((mutations, observer) => {
				for(const { addedNodes } of mutations){
					for(const node of addedNodes){
						if((node as HTMLElement).classList?.contains("document-viewer")){
							observer.disconnect()
							this.observers.delete(observerId++)
							resolve()
							return
						}
					}
				}
			})

			observer.observe(fileContainer, {
				childList: true,
				subtree: true
			})

			this.observers.set(observerId, observer)
		})

		const documentContainer = fileViewer.querySelector<HTMLDivElement>(".document-fragment")!

		function RemoveBlur(page: HTMLDivElement){
			page.querySelector(".mv-content-limitation-fake-page.short-preview-version.short-preview-version-background")?.parentElement!.remove()

			for(const element of page.querySelectorAll<HTMLElement>("[style*=filter]")){
				element.removeAttribute("style")
			}
		}

		const observer = new MutationObserver(mutations => {
			for(const { target, addedNodes } of mutations){
				if(!(target as HTMLElement).classList?.contains("page-container")){
					if((target as HTMLElement).classList?.contains("page-content")){
						const page = target.parentElement as HTMLDivElement
						RemoveBlur(page)
					}

					continue
				}

				for(const page of addedNodes as NodeListOf<HTMLDivElement>){
					RemoveBlur(page)

					if(page.dataset.pdBypass) continue

					if(this.observers.has(observerId)){
						this.observers.get(observerId)!.disconnect()
						this.observers.delete(observerId)
					}

					const observer = new MutationObserver(() => RemoveBlur(page))

					observer.observe(page, {
						childList: true,
						subtree: true
					})

					this.observers.set(observerId, observer)
					page.dataset.pdBypass = "true"
				}
			}
		})

		observer.observe(documentContainer, {
			childList: true,
			subtree: true
		})

		this.observers.set(observerId++, observer)
	}
	async SetQuestionObserver(){
		if(this.isQuestionObserver) return
		if(this.observers.size) console.warn("There were active observers")

		this.isQuestionObserver = true

		const answersPromise = this.GetAnswers()

		answersPromise.then(answers => this.answers = answers)

		let observerId = 0

		const main = this.main || await this.mainPromise

		await new Promise<void>(resolve => {
			const observer = new MutationObserver((mutations, observer) => {
				for(const { target, addedNodes } of mutations){
					if((target as HTMLElement).classList?.contains("mv-answers-frame")){
						observer.disconnect()
						this.observers.delete(observerId++)
						resolve()
						return
					}
				}
			})

			observer.observe(main, {
				childList: true,
				subtree: true
			})

			this.observers.set(observerId, observer)
		})

		const answersFrame = main.querySelector<HTMLDivElement>(".mv-answers-frame")!
		const answersContainer = answersFrame.querySelector<HTMLDivElement>(".answers-list div:not(.loading-answers-frame)")

		try{
			if(!answersContainer){
				this.isQuestionObserver = false
				throw new Error("Answers container not found")
			}

			// Wait for answers elements
			await new Promise<void>((resolve, reject) => {
				const id = observerId
				const observer = new MutationObserver(() => {
					observerId++
					this.observers.delete(id)
					resolve()
				})

				observer.observe(answersContainer, { childList: true })

				this.observers.set(id, observer)

				setTimeout(() => {
					if(this.observers.has(id)){
						reject(new Error("No answers found"))
						this.observers.delete(id)
					}
				}, 10e3)
			})

			const answers = answersContainer.querySelectorAll<HTMLDivElement>(".mv-answer-card")

			for(const answerElement of answers){
				try{
					const id = answerElement.getAttribute("answer-id")

					if(!id) throw new Error("Undefined answer ID")

					const answer = this.answers.find(({ Id }) => Id === Number(id))

					if(!answer) throw new Error("Answer not found in API response")

					const userHeader = answerElement.querySelector<HTMLDivElement>(".user-header")!

					userHeader.classList.remove("blocked")

					const answerContent = answerElement.querySelector<HTMLDivElement>(".answer-content")!
					const answerText = answerContent.querySelector<HTMLDivElement>(".answers-text")!
					const answerEvaluation = answerContent.querySelector<HTMLDivElement>(".answer-evaluation")!

					answerText.removeAttribute("style")
					answerText.classList.remove("blocked")
					answerEvaluation.classList.remove("blocked")

					answerText.innerHTML = answer.Text
				}catch(error){
					console.error(error)
				}
			}
		}catch(error){
			console.error(error)
		}
	}
	async GetAnswers({ orderBy = 0, page = 0, size = 5 }: {
		orderBy?: number
		page?: number
		size?: number
	} = {}){
		const url = new URL(`https://material-api.passeidireto.com/questions/${this.id}/answers`)

		url.searchParams.set("orderBy", orderBy.toString())
		url.searchParams.set("page", page.toString())
		url.searchParams.set("size", size.toString())

		const response = await fetch(url, {
			headers: {
				accept: "application/json, text/plain, */*",
				"pd-app-client-version": "1.169.15",
			},
			mode: "cors",
			credentials: "include"
		})

		const { answers } = await response.json() as APIAnswersResponse

		return answers
	}
	AddExtensionListeners(){
		chrome.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
			const { action, data } = message

			switch(action){
				case "isContentScriptInjected": return sendResponse(true)
			}
		})
	}
}
