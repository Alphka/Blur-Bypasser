console.log("Running")

/** @param {number} tabId */
async function HasContentScript(tabId){
	if(!tabId) return false

	let success = false

	try{
		const response = await chrome.tabs.sendMessage(tabId, { action: "isContentScriptInjected" })
		return success = response
	}catch{}

	return success
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	if(!tab.url) return

	const url = new URL(tab.url)

	if(changeInfo.status === "complete" && url.hostname === "www.passeidireto.com"){
		if(await HasContentScript(tabId)) return

		console.log("Injecting")
		chrome.scripting.executeScript({
			target: { tabId, allFrames: false },
			files: ["src/contentScript.js"],
			injectImmediately: true
		})
	}
})

const bannedHosts = [
	"resources.passeidireto.com/pd-cookie-banner/latest/index.js",
	"interaction-api.passeidireto.com/materials/*/contentViews",
	"pd-app-frontend.passeidireto.com/app/static/libs/smartbanner/smartbanner.min.js",
	"pd-app-frontend.passeidireto.com/app/static/libs/smartbanner/smartbanner.min.css",
	"pd-app-frontend.passeidireto.com/app/static/webPolyfill.min.js",
	"modules-frontend.passeidireto.com/pd-edit-components/*/pd-edit-components.umd.min.js",
	"modules-frontend.passeidireto.com/pd-one-click-checkout-frontend/*/pd-one-click-checkout-frontend.umd.min.js",
	"modules-frontend.passeidireto.com/pd-limitation-frontend/*/pd-limitation-frontend.umd.min.js",
	"modules-frontend.passeidireto.com/tag/*/tag.umd.min.js",
	"tracking-api.passeidireto.com/track",
	"cloudfront.net/tracker.js",
	"sslwidget.criteo.com/event",
	"www.facebook.com/tr",
	"connect.facebook.net/*/fbevents.js"
]

const bannedThirdParties = [
	"amazonaws.com/*/cwr.js",
	"dataplane.rum.us-east-2.amazonaws.com",
	"checkoutshopper-live-us.adyen.com/checkoutshopper/sdk/*/adyen.js",
	"checkoutshopper-live-us.adyen.com/checkoutshopper/sdk/*/adyen.css",
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
	"s.pinimg.com/ct/core.js"
]

chrome.declarativeNetRequest.updateDynamicRules({
	removeRuleIds: bannedHosts.concat(...bannedThirdParties).map((filter, index) => index + 1),
	addRules: bannedHosts.map((filter, index) => /** @type {chrome.declarativeNetRequest.Rule} */ ({
		id: index + 1,
		action: {
			type: "block"
		},
		condition: {
			urlFilter: "||" + filter,
			resourceTypes: [
				"main_frame",
				"sub_frame",
				"stylesheet",
				"script",
				"image",
				"font",
				"object",
				"xmlhttprequest",
				"ping",
				"csp_report",
				"media",
				"websocket",
				"other"
			]
		}
	}))
	.concat(...bannedThirdParties.map((filter, index) => /** @type {chrome.declarativeNetRequest.Rule} */ ({
		id: bannedHosts.length + index + 1,
		action: {
			type: "block"
		},
		condition:{
			urlFilter: "||" + filter,
			resourceTypes: [
				"main_frame",
				"sub_frame",
				"stylesheet",
				"script",
				"image",
				"font",
				"object",
				"xmlhttprequest",
				"ping",
				"csp_report",
				"media",
				"websocket",
				"other"
			],
			domainType: "thirdParty",
			initiatorDomains: ["www.passeidireto.com"]
		}
	})))
})
