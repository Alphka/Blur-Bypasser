type Booleanish = boolean | "true" | "false"

export interface CreateElementOptions {
	accept?: string
	acceptCharset?: string
	action?: string | undefined
	allowFullScreen?: boolean
	allowTransparency?: boolean
	alt?: string
	as?: string
	async?: boolean
	autoComplete?: string
	autoPlay?: boolean
	capture?: boolean | "user" | "environment"
	cellPadding?: number | string
	cellSpacing?: number | string
	charSet?: string
	challenge?: string
	checked?: boolean
	cite?: string
	classID?: string
	cols?: number
	colSpan?: number
	controls?: boolean
	coords?: string
	crossOrigin?: "anonymous" | "use-credentials" | ""
	data?: string
	dateTime?: string
	default?: boolean
	defer?: boolean
	disabled?: boolean
	download?: any;
	encType?: string
	form?: string
	formAction?: string | undefined
	formEncType?: string
	formMethod?: string
	formNoValidate?: boolean
	formTarget?: string
	/** @deprecated */
	frameBorder?: number | string
	headers?: string
	height?: number | string
	high?: number
	href?: string
	hrefLang?: string
	htmlFor?: string
	httpEquiv?: string
	integrity?: string
	keyParams?: string
	keyType?: string
	kind?: string
	label?: string
	list?: string
	loop?: boolean
	low?: number
	manifest?: string
	/** @deprecated */
	marginHeight?: number
	/** @deprecated */
	marginWidth?: number
	max?: number | string
	maxLength?: number
	media?: string
	mediaGroup?: string
	method?: string
	min?: number | string
	minLength?: number
	multiple?: boolean
	muted?: boolean
	name?: string
	noValidate?: boolean
	open?: boolean
	optimum?: number
	pattern?: string
	placeholder?: string
	playsInline?: boolean
	poster?: string
	preload?: string
	readOnly?: boolean
	required?: boolean
	reversed?: boolean
	rows?: number
	rowSpan?: number
	sandbox?: string
	scope?: string
	scoped?: boolean
	/** @deprecated */
	scrolling?: string
	seamless?: boolean
	selected?: boolean
	shape?: string
	size?: number
	sizes?: string
	span?: number
	src?: string
	srcDoc?: string
	srcLang?: string
	srcSet?: string
	start?: number
	step?: number | string
	summary?: string
	target?: string
	type?: string
	useMap?: string
	value?: string | ReadonlyArray<string> | number
	width?: number | string
	wmode?: string
	wrap?: string
	innerHTML?: string | number
	innerText?: string | number
	textContent?: string | number
	title?: string
	class?: string
	className?: string
	id?: string

	ping?: string

	allow?: string

	loading?: "eager" | "lazy"

	decoding?: "async" | "auto" | "sync"

	referrerPolicy?: "" | "same-origin" | "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url"

    enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send"

	fetchPriority?: "high" | "low" | "auto";
	imageSrcSet?: string
	imageSizes?: string
	controlsList?: string
	content?: string
	noModule?: boolean

	align?: "left" | "center" | "right"
	bgcolor?: string
	border?: number
	frame?: boolean
	rules?: "none" | "groups" | "rows" | "columns" | "all"
	dirName?: string
	valign?: "top" | "middle" | "bottom" | "baseline"

	disablePictureInPicture?: boolean
	disableRemotePlayback?: boolean

	color?: string
	lang?: string
	style?: string

	// Other HTML properties supported by SVG elements in browsers
	tabIndex?: number

	// SVG Specific attributes
	accentHeight?: number | string
	accumulate?: "none" | "sum"
	additive?: "replace" | "sum"
	alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit"
	allowReorder?: "no" | "yes"
	alphabetic?: number | string
	amplitude?: number | string
	arabicForm?: "initial" | "medial" | "terminal" | "isolated"
	ascent?: number | string
	attributeName?: string
	attributeType?: string
	autoReverse?: Booleanish
	azimuth?: number | string
	baseFrequency?: number | string
	baselineShift?: number | string
	baseProfile?: number | string
	bbox?: number | string
	begin?: number | string
	bias?: number | string
	by?: number | string
	calcMode?: number | string
	capHeight?: number | string
	clip?: number | string
	clipPath?: string
	clipPathUnits?: number | string
	clipRule?: number | string
	colorInterpolation?: number | string
	colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit"
	colorProfile?: number | string
	colorRendering?: number | string
	contentScriptType?: number | string
	contentStyleType?: number | string
	cursor?: number | string
	cx?: number | string
	cy?: number | string
	d?: string
	decelerate?: number | string
	descent?: number | string
	diffuseConstant?: number | string
	direction?: number | string
	display?: number | string
	divisor?: number | string
	dominantBaseline?: number | string
	dur?: number | string
	dx?: number | string
	dy?: number | string
	edgeMode?: number | string
	elevation?: number | string
	enableBackground?: number | string
	end?: number | string
	exponent?: number | string
	externalResourcesRequired?: Booleanish
	fill?: string
	fillOpacity?: number | string
	fillRule?: "nonzero" | "evenodd" | "inherit"
	filter?: string
	filterRes?: number | string
	filterUnits?: number | string
	floodColor?: number | string
	floodOpacity?: number | string
	focusable?: Booleanish | "auto"
	fontFamily?: string
	fontSize?: number | string
	fontSizeAdjust?: number | string
	fontStretch?: number | string
	fontStyle?: number | string
	fontVariant?: number | string
	fontWeight?: number | string
	format?: number | string
	fr?: number | string
	from?: number | string
	fx?: number | string
	fy?: number | string
	g1?: number | string
	g2?: number | string
	glyphName?: number | string
	glyphOrientationHorizontal?: number | string
	glyphOrientationVertical?: number | string
	glyphRef?: number | string
	gradientTransform?: string
	gradientUnits?: string
	hanging?: number | string
	horizAdvX?: number | string
	horizOriginX?: number | string
	ideographic?: number | string
	imageRendering?: number | string
	in2?: number | string
	in?: string
	intercept?: number | string
	k1?: number | string
	k2?: number | string
	k3?: number | string
	k4?: number | string
	k?: number | string
	kernelMatrix?: number | string
	kernelUnitLength?: number | string
	kerning?: number | string
	keyPoints?: number | string
	keySplines?: number | string
	keyTimes?: number | string
	lengthAdjust?: number | string
	letterSpacing?: number | string
	lightingColor?: number | string
	limitingConeAngle?: number | string
	local?: number | string
	markerEnd?: string
	markerHeight?: number | string
	markerMid?: string
	markerStart?: string
	markerUnits?: number | string
	markerWidth?: number | string
	mask?: string
	maskContentUnits?: number | string
	maskUnits?: number | string
	mathematical?: number | string
	mode?: number | string
	numOctaves?: number | string
	offset?: number | string
	opacity?: number | string
	operator?: number | string
	order?: number | string
	orient?: number | string
	orientation?: number | string
	origin?: number | string
	overflow?: number | string
	overlinePosition?: number | string
	overlineThickness?: number | string
	paintOrder?: number | string
	panose1?: number | string
	path?: string
	pathLength?: number | string
	patternContentUnits?: string
	patternTransform?: number | string
	patternUnits?: string
	pointerEvents?: number | string
	points?: string
	pointsAtX?: number | string
	pointsAtY?: number | string
	pointsAtZ?: number | string
	preserveAlpha?: Booleanish
	preserveAspectRatio?: string
	primitiveUnits?: number | string
	r?: number | string
	radius?: number | string
	refX?: number | string
	refY?: number | string
	renderingIntent?: number | string
	repeatCount?: number | string
	repeatDur?: number | string
	requiredExtensions?: number | string
	requiredFeatures?: number | string
	restart?: number | string
	result?: string
	rotate?: number | string
	rx?: number | string
	ry?: number | string
	scale?: number | string
	seed?: number | string
	shapeRendering?: number | string
	slope?: number | string
	spacing?: number | string
	specularConstant?: number | string
	specularExponent?: number | string
	speed?: number | string
	spreadMethod?: string
	startOffset?: number | string
	stdDeviation?: number | string
	stemh?: number | string
	stemv?: number | string
	stitchTiles?: number | string
	stopColor?: string
	stopOpacity?: number | string
	strikethroughPosition?: number | string
	strikethroughThickness?: number | string
	string?: number | string
	stroke?: string
	strokeDasharray?: string | number
	strokeDashoffset?: string | number
	strokeLinecap?: "butt" | "round" | "square" | "inherit"
	strokeLinejoin?: "miter" | "round" | "bevel" | "inherit"
	strokeMiterlimit?: number | string
	strokeOpacity?: number | string
	strokeWidth?: number | string
	surfaceScale?: number | string
	systemLanguage?: number | string
	tableValues?: number | string
	targetX?: number | string
	targetY?: number | string
	textAnchor?: string
	textDecoration?: number | string
	textLength?: number | string
	textRendering?: number | string
	to?: number | string
	transform?: string
	u1?: number | string
	u2?: number | string
	underlinePosition?: number | string
	underlineThickness?: number | string
	unicode?: number | string
	unicodeBidi?: number | string
	unicodeRange?: number | string
	unitsPerEm?: number | string
	vAlphabetic?: number | string
	values?: string
	vectorEffect?: number | string
	version?: string
	vertAdvY?: number | string
	vertOriginX?: number | string
	vertOriginY?: number | string
	vHanging?: number | string
	vIdeographic?: number | string
	viewBox?: string
	viewTarget?: number | string
	visibility?: number | string
	vMathematical?: number | string
	widths?: number | string
	wordSpacing?: number | string
	writingMode?: number | string
	x1?: number | string
	x2?: number | string
	x?: number | string
	xChannelSelector?: string
	xHeight?: number | string
	xlinkActuate?: string
	xlinkArcrole?: string
	xlinkHref?: string
	xlinkRole?: string
	xlinkShow?: string
	xlinkTitle?: string
	xlinkType?: string
	xmlBase?: string
	xmlLang?: string
	xmlns?: string
	xmlnsXlink?: string
	xmlSpace?: string
	y1?: number | string
	y2?: number | string
	y?: number | string
	yChannelSelector?: string
	z?: number | string
	zoomAndPan?: string
	allowpopups?: boolean
	autosize?: boolean
	blinkfeatures?: string
	disableblinkfeatures?: string
	disableguestresize?: boolean
	disablewebsecurity?: boolean
	guestinstance?: string
	httpreferrer?: string
	nodeintegration?: boolean
	partition?: string
	plugins?: boolean
	useragent?: string
	webpreferences?: string

	children?: Element[]
}

let a = {} as CreateElementOptions

function CreateElement<T extends keyof HTMLElementTagNameMap>(tagName: T, options?: CreateElementOptions): HTMLElementTagNameMap[T]
function CreateElement(tagName: string, options?: CreateElementOptions): HTMLElement
function CreateElement<T extends keyof HTMLElementTagNameMap>(options?: CreateElementOptions & { tagName?: T }): HTMLElementTagNameMap[T]
function CreateElement(options?: CreateElementOptions & { tagName?: string }): HTMLElement
function CreateElement(){
	let element: HTMLElement
	let options: CreateElementOptions

	switch(typeof arguments[0]){
		case "string":
			element = document.createElement(arguments[0])
			options = arguments[1] ?? {}
		break
		case "object":
			if(!arguments[0].tagName) throw new Error("tagName is not defined")

			element = document.createElement(arguments[0].tagName)
			options = arguments[0]

			delete (options as CreateElementOptions & { tagName?: string }).tagName
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

export default CreateElement
