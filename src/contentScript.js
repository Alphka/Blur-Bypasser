/// <reference types="../typings" />

new class ContentScript {
	constructor(){
		if(!document.documentElement.dataset.pdBypass) document.documentElement.dataset.pdBypass = "true"
		else{
			console.error("Script injected multiple times")
			return
		}

		this.AddListeners()
		this.Init()
	}
	async Init(){
		const [type, id] = location.pathname.substring(1).split("/", 2)

		this.type = type
		this.id = id

		switch(type){
			case "arquivo": return this.DocumentBlurObserver()
			case "pergunta": return this.answers = await this.GetAnswers()
		}
	}
	AddListeners(){
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			/** @type {BackgroundMessage} */
			const { action, data } = message

			switch(action){
				case "isContentScriptInjected": return sendResponse(true)
				case "getAnswers":
					if(this.type !== "pergunta"){
						return sendResponse(undefined)
					}

					if(!this.answers){
						this.GetAnswers().then(answers => this.answers = answers)
						return sendResponse(null)
					}

					return sendResponse(this.answers)
			}
		})
	}
	async DocumentBlurObserver(){
		/** @type {HTMLDivElement} */
		const fileContainer = await new Promise(resolve => {
			new MutationObserver((mutations, observer) => {
				for(const { addedNodes } of mutations){
					for(const node of addedNodes){
						if(/** @type {HTMLElement} */ (node).classList?.contains("mv-file-container")){
							observer.disconnect()
							resolve(/** @type {HTMLDivElement} */ (node))
						}
					}
				}
			}).observe(document.body, {
				childList: true,
				subtree: true
			})
		})

		const fileViewer = document.body.querySelector("#file-viewer")

		await new Promise(resolve => {
			new MutationObserver((mutations, observer) => {
				for(const { addedNodes } of mutations){
					for(const node of addedNodes){
						if(/** @type {HTMLElement} */ (node).classList?.contains("document-viewer")){
							observer.disconnect()
							resolve()
						}
					}
				}
			}).observe(fileContainer, {
				childList: true,
				subtree: true
			})
		})

		const documentContainer = fileViewer.querySelector(".document-fragment")

		/** @param {HTMLDivElement} page */
		function RemoveBlur(page){
			page.querySelector(".mv-content-limitation-fake-page.short-preview-version.short-preview-version-background")?.parentElement.remove()

			for(const element of /** @type {NodeListOf<HTMLElement>} */ (page.querySelectorAll("[style*=filter]"))){
				element.removeAttribute("style")
			}
		}

		new MutationObserver(mutations => {
			for(const { target, addedNodes } of mutations){
				if(!/** @type {HTMLElement} */ (target).classList?.contains("page-container")){
					if(/** @type {HTMLElement} */ (target).classList?.contains("page-content")){
						const page = /** @type {HTMLDivElement} */ (target.parentElement)
						RemoveBlur(page)
					}

					continue
				}

				// @ts-ignore
				for(const page of /** @type {HTMLDivElement[]} */ (addedNodes)){
					RemoveBlur(page)

					if(page.dataset.pdBypass) continue

					new MutationObserver(mutations => {
						RemoveBlur(page)
					}).observe(page, {
						childList: true,
						subtree: true
					})

					page.dataset.pdBypass = "true"
				}
			}
		}).observe(documentContainer, {
			childList: true,
			subtree: true
		})
	}
	async GetAnswers({ orderBy = 0, page = 0, size = 5 } = {}){
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

		/** @type {APIAnswersResponse} */
		const { answers } = await response.json()

		return answers
	}
}
