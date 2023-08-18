import type { APIAnswer } from "../../typings"
import CreateElement from "../helpers/CreateElement"

const main = document.body.querySelector("main")!
const button = main.querySelector<HTMLButtonElement>(":scope > button#getAnswers")!

button.addEventListener("click", async event => {
	event.preventDefault()

	const content = document.querySelector<HTMLDivElement>("#content")!
	const fragment = document.createDocumentFragment()

	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

	const answers: APIAnswer[] = await chrome.tabs.sendMessage(tab.id!, { action: "getAnswers" })

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
					innerHTML: Array.from((new DOMParser().parseFromString(Text, "text/html").activeElement as HTMLBodyElement).childNodes)
						.map(element => (element instanceof HTMLElement ? element.innerText : element.textContent!).trim())
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

let lastTimeout: ReturnType<typeof setTimeout>

function showError(error: string){
	if(lastTimeout) clearTimeout(lastTimeout)

	const element: HTMLSpanElement = main.querySelector("#getAnswers ~ .error") || CreateElement("span", { className: "error" })

	element.innerText = error

	button.after(element)

	lastTimeout = setTimeout(() => {
		element.innerText = ""
		element.remove()
	}, 6e3)
}
