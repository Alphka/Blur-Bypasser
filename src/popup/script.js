const main = document.body.querySelector("main")
const button = /** @type {HTMLButtonElement} */ (main.querySelector(":scope > button#getAnswers"))

button.addEventListener("click", async event => {
	event.preventDefault()

	/** @type {HTMLDivElement} */
	const content = document.querySelector("#content")
	const fragment = document.createDocumentFragment()

	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

	/** @type {APIAnswersResponse["answers"]} */
	const answers = await chrome.tabs.sendMessage(tab.id, { action: "getAnswers" })

	if(answers === undefined) return showError("Você precisa abrir uma pergunta na aba atual")
	if(answers === null) return showError("Ocorreu um erro. Tente novamente.")

	for(const { User, Text, Id } of answers){
		const container = CreateElement("section", {
			className: "container",
			children: [
				CreateElement("header", {
					children: [
						CreateElement("h2", {
							className: "username",
							innerText: User.FullName
						}),
						CreateElement("h2", {
							className: "answerId",
							innerText: Id
						})
					]
				}),
				CreateElement("section", {
					className: "content",
					innerHTML: Array.from(new DOMParser().parseFromString(Text, "text/html").activeElement.childNodes)
						.map(element => (element instanceof HTMLElement ? element.innerText : element.textContent).trim())
						.join("<br>")
						.replace(/\n+/g, "<br>")
				})
			]
		})

		fragment.appendChild(container)
	}

	if(content.childElementCount) content.innerHTML = ""

	content.appendChild(fragment)
})

let lastTimeout

/** @param {string} error */
function showError(error){
	if(lastTimeout) clearTimeout(lastTimeout)

	/** @type {HTMLSpanElement} */
	const element = main.querySelector("#getAnswers ~ .error") || CreateElement("span", { className: "error" })

	element.innerText = error

	button.after(element)

	lastTimeout = setTimeout(() => {
		element.innerText = ""
		element.remove()
	}, 6e3)
}

function CreateElement(){
	/** @type {HTMLElement} */
	let element
	let options

	switch(typeof arguments[0]){
		case "string":
			element = document.createElement(arguments[0])
			options = arguments[1] ?? {}
		break
		case "object":
			if(!arguments[0].tagName) throw new Error("tagName is not defined")

			element = document.createElement(arguments[0].tagName)
			options = arguments[0]

			delete options.tagName
		break
		default: throw new Error(`args cannot be a type of ${typeof arguments[0]}`)
	}

	if(options.children){
		options.children.forEach(child => element.appendChild(child))
		delete options.children
	}

	for(const [attribute, value] of Object.entries(options)){
		if(typeof value === "boolean" || attribute in element) element[attribute] = value, delete options[attribute]
		else element.setAttribute(attribute, value)
	}

	return element
}
