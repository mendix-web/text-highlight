
document.addEventListener("DOMContentLoaded", function () {
	/**
	 * 
	 * @param {HTMLElement} el 
	 */
	const addMark = function (el) {
		if (el && el.innerHTML) {
			el.innerHTML = `<mark>${el.innerHTML}</mark>`;
		}
	}

	/**
	 * 
	 * @param {string} targetText 
	 * @param {HTMLElement} contextNode 
	 * @returns {HTMLElement}
	 */
	const locateElementByText = function (targetText, contextNode) {
		if (!targetText) {
			return null;
		}
		contextNode = contextNode ?? document.body;

		/*
		* By default, this JS snippet finds the element by an exact match.
		* If you want to use a partial match, replace the xpath expression with following:
		*   ${targetTagName}[contains(text(), "${targetText}")]
		*/
		const xpath = `.//*[contains(text(),"${targetText}")]`;
		const element = document.evaluate(
			xpath,
			contextNode,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;

		if (!element) {
			// throw new Error(`Error: Element not found (${xpath})`);
		} else {
			return element;
		}
	}

	/**
	 * 
	 * @param {HTMLElement} contextNode 
	 * @returns {Object}
	 */
	const locateNodes = function (contextNode) {
		let nodes = {
			start: locateElementByText(highlightComponents[0], contextNode),
			end: locateElementByText(highlightComponents[1], contextNode),
		};

		if (!nodes.start && !nodes.end) {
			nodes = {
				start: locateElementByText(highlightComponents[0]),
				end: locateElementByText(highlightComponents[1]),
			};
		}

		return nodes;
	};

	const req = (
		/**
		 *  Get the highlight request.
		 * 
		 * @returns {object}
		 */
		function () {
			const postHash = document.URL.split('#');
			if (postHash.length > 1) {
				const splitByText = postHash[1].split(':~:text=');
				if (splitByText.length > 1) {
					const anchor = splitByText[0];
					const highlight = decodeURIComponent(splitByText[1]);
					return { anchor, highlight };
				}
			}
		}
	)();

	if (!req) {
		return;
	}

	// Add some markup to the selected text.
	const highlightComponents = (function () {
		if (req.highlight.includes('-,')) {
			const text =
				req.highlight.substring(
					req.highlight.indexOf('-,') + (('-,'.length)),
					req.highlight.lastIndexOf(',-'),
				);
			return text.split(',');
		} else {
			return req.highlight.split(',');
		}
	})();

	const context = document.getElementById(req.anchor) ??
		locateElementByText(highlightComponents[0]) ??
		document.body;


	const nodes = locateNodes(context.parentNode);
	console.log(nodes);
	if (nodes.start) {
		const nodesToHighlight = [nodes.start];
		if (nodes.end) {
			const max = 20;
			let i = 0;
			let isEndingFound = false;
			let currentNode = nodes.start;
			while (!isEndingFound && ++i < max) {
				currentNode = currentNode.nextSibling;
				// If there are no nodes left to traverse.
				if (!currentNode) break;
				// If moved past the element vertically on the page.
				if (currentNode.offsetTop > nodes.end.offsetTop) break;

				// Push node to highlights.
				nodesToHighlight.push(currentNode);
				// End loop when current node reaches ending node, 
				if (currentNode === nodes.end) break;
			}
		}

		while (nodesToHighlight.length) {
			addMark(nodesToHighlight.pop());
		}

		// Allow re-paint frame before scrolling
		setTimeout(function () {
			window.scrollTo(0, nodes.start.offsetTop - 150);
		}, 0);
	}

});
