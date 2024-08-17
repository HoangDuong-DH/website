// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2022 The Bootstrap Authors
 * Copyright 2011-2022 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 * For details, see https://creativecommons.org/licenses/by/3.0/.
 */

/* global ClipboardJS: false, bootstrap: false */

(() => {
	'use strict';

	// Insert copy to clipboard button before .highlight
	const btnTitle = 'Copy to clipboard';

	const btnHtml = [
		'<div class="doc-code-snippet">',
		'   <div class="doc-clipboard">',
		'      <button type="button" class="btn-clipboard">',
		'        <svg class="bi" width="1em" height="1em" fill="currentColor" role="img" aria-label="Copy"><use xlink:href="#clipboard"/></svg>',
		'      </button>',
		'   </div>',
		'</div>'
	].join('');

	// wrap programmatically code blocks and add copy btn.
	document.querySelectorAll('.doc-example-markup')
		.forEach(element => {
			if (!element.closest('.doc-code-snippet')) { // Ignore examples made be shortcode
				element.insertAdjacentHTML('beforebegin', btnHtml)
				element.previousElementSibling.append(element)
			}
		})

	/**
	 *
	 * @param {string} selector
	 * @param {string} title
	 */
	function snippetButtonTooltip(selector, title) {
		document.querySelectorAll(selector).forEach(btn => {
			bootstrap.Tooltip.getOrCreateInstance(btn, {title})
		})
	}

	snippetButtonTooltip('.btn-clipboard', btnTitle)

	const clipboard = new ClipboardJS('.btn-clipboard', {
		target: trigger => trigger.closest('.doc-code-snippet').querySelector('.doc-example-markup')
	})

	clipboard.on('success', event => {
		const iconFirstChild = event.trigger.querySelector('.bi').firstChild
		const tooltipBtn = bootstrap.Tooltip.getInstance(event.trigger)
		const namespace = 'http://www.w3.org/1999/xlink'
		const originalXhref = iconFirstChild.getAttributeNS(namespace, 'href')
		const originalTitle = event.trigger.title

		tooltipBtn.setContent({'.tooltip-inner': 'Copied!'})
		event.trigger.addEventListener('hidden.bs.tooltip', () => {
			tooltipBtn.setContent({'.tooltip-inner': btnTitle})
		}, {once: true})
		event.clearSelection()
		iconFirstChild.setAttributeNS(namespace, 'href', originalXhref.replace('clipboard', 'check2'))

		setTimeout(() => {
			iconFirstChild.setAttributeNS(namespace, 'href', originalXhref)
			event.trigger.title = originalTitle
		}, 2000)
	})

	clipboard.on('error', event => {
		const modifierKey = /mac/i.test(navigator.userAgent) ? '\u2318' : 'Ctrl-'
		const fallbackMsg = `Press ${modifierKey}C to copy`
		const tooltipBtn = bootstrap.Tooltip.getInstance(event.trigger)

		tooltipBtn.setContent({'.tooltip-inner': fallbackMsg})
		event.trigger.addEventListener('hidden.bs.tooltip', () => {
			tooltipBtn.setContent({'.tooltip-inner': btnTitle})
		}, {once: true})
	})
})()