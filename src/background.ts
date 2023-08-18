import type { BackgroundMessage } from "../typings"

async function HasContentScript(tabId: number){
	if(!tabId) return false

	let success = false

	try{
		const response = await chrome.tabs.sendMessage<BackgroundMessage, boolean>(tabId, { action: "isContentScriptInjected" })
		return success = response
	}catch{}

	return success
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if(!tab.url) return

	const url = new URL(tab.url)

	if(changeInfo.status === "complete" && url.hostname === "www.passeidireto.com"){
		if(await HasContentScript(tabId)) return

		chrome.scripting.executeScript({
			target: { tabId, allFrames: false },
			files: ["contentScript.js"],
			injectImmediately: true
		})
	}
})

class BannedHosts {
	static all = [
		"resources.passeidireto.com/pd-cookie-banner/latest/index.js",
		"interaction-api.passeidireto.com/materials/*/contentViews",
		"pd-app-frontend.passeidireto.com/app/static/libs/smartbanner/*",
		"pd-app-frontend.passeidireto.com/app/static/webPolyfill.min.js",
		"modules-frontend.passeidireto.com/pd-edit-components/*/pd-edit-components.umd.min.js",
		"modules-frontend.passeidireto.com/pd-one-click-checkout-frontend/*/pd-one-click-checkout-frontend.umd.min.js",
		"modules-frontend.passeidireto.com/pd-limitation-frontend/*/pd-limitation-frontend.umd.min.js",
		"modules-frontend.passeidireto.com/tag/*/tag.umd.min.js",
		"tracking-api.passeidireto.com/track",
		"cloudfront.net/tracker.js",
		"sslwidget.criteo.com/event",
		"www.facebook.com/tr",
		"connect.facebook.net/*",
		"data.gosquared.com/pv",
		"chat.gosquared.com/chat",
		"data2.gosquared.com/pv"
	]
	static thirdParties = [
		"amazonaws.com/*/cwr.js",
		"dataplane.rum.us-east-2.amazonaws.com",
		"checkoutshopper-live-us.adyen.com/checkoutshopper/*",
		"dropbox.com/static/api/*/dropins.js",
		"apis.google.com/js/api.js",
		"u.clarity.ms/collect",
		"sslwidget.criteo.com/event",
		"www.google.com/pagead/*",
		"www.google-analytics.com/analytics.js",
		"www.googletagservices.com/tag/js/gpt.js",
		"www.googletagmanager.com/gtm.js",
		"www.googletagmanager.com/ns.html",
		"googleads.g.doubleclick.net/pagead/*",
		"www.google-analytics.com/plugins/ua/ecommerce.js",
		"static.criteo.net/js/ld/ld.js",
		"sentry.io/api",
		"www.clarity.ms/tag",
		"dntcl.qualaroo.com/frame.html",
		"static.hotjar.com/c/*",
		"s.pinimg.com/ct/core.js",
		"cloudfront.net/gosquared.js"
	]
	static get rules(){
		const rules = new Array<chrome.declarativeNetRequest.Rule>
		const rule: chrome.declarativeNetRequest.Rule = {
			action: {
				// @ts-expect-error
				type: "block"
			},
			condition: {
				// @ts-expect-error
				resourceTypes: ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"]
			}
		}

		let id = 1

		rules.push(...this.all.map(filter => Object.assign({}, rule, {
			id: id++,
			condition: {
				urlFilter: "||" + filter,
				...rule.condition
			}
		} as chrome.declarativeNetRequest.Rule)))

		rules.push(...this.thirdParties.map(filter => Object.assign({}, rule, {
			id: id++,
			condition: {
				urlFilter: "||" + filter,
				domainType: "thirdParty",
				initiatorDomains: ["www.passeidireto.com"],
				...rule.condition
			},
		} as chrome.declarativeNetRequest.Rule)))

		return rules
	}
	static get size(){
		return this.all.length + this.thirdParties.length
	}
}

chrome.declarativeNetRequest.updateDynamicRules({
	removeRuleIds: Array.from(new Array(BannedHosts.size), (_, index) => index + 1),
	addRules: BannedHosts.rules
})
