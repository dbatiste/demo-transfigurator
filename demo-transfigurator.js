import { LitElement, html } from 'lit-element/lit-element.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { demoTransfiguratorStyles } from './demo-transfigurator-styles.js';
import { demoTransfiguratorCodeStyles } from './demo-transfigurator-code-dark-plus-styles.js';
import 'prismjs/prism.js';

export class DemoTransfigurator extends LitElement {

	static get properties() {
		return {
			noPadding: { type: Boolean, reflect: true, attribute: 'no-padding' },
			_codeHTML: { type: String }
		};
	}

	static get styles() {
		return [
			demoTransfiguratorCodeStyles,
			demoTransfiguratorStyles
		];
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<div class="demo-transfigurator-demo">
				<slot @slotchange="${this._handleSlotChange}"></slot>
			</div>
			<div class="demo-transfigurator-code">${this._codeTemplate}</div>
		`;
	}

	firstUpdated() {
		this._updateCode(this.shadowRoot.querySelector('slot'));
	}

	get _codeTemplate() {
		return html`<pre class="language-html"><code class="language-html">${unsafeHTML(this._codeHTML)}</code></pre>`;
	}

	_handleSlotChange(e) {
		this._updateCode(e.target);
	}

	_unIndent(text) {
		// Convert tabs to spaces and then shift indent, modified from:
		// https://github.com/PolymerElements/marked-element/blob/master/marked-element.js#L340-359
		if (!text) return text;

		// fix script whitespace
		var lines = text.replace(/\t/g, '  ').replace(/<\/script>/g,'\n</script>').replace(/<script>/g,'<script>\n').split('\n');
		var scriptIndent = 0;
		lines = lines.map(function(l) {
			if (l.indexOf('<script>') > -1) {
				scriptIndent = l.match(/^(\s*)/)[0].length;
				return l;
			} else if (l.indexOf('</script>') > -1) {
				var nl = ' '.repeat(scriptIndent) + l;
				scriptIndent = 0;
				return nl;
			} else if (scriptIndent) {
				return ' '.repeat(scriptIndent + 2) + l;
			} else {
				return l;
			}
		});

		var indent = lines.reduce(function(prev, line) {

			// completely ignore blank lines
			if (/^\s*$/.test(line)) return prev;

			var lineIndent = line.match(/^(\s*)/)[0].length;
			if (prev === null) return lineIndent;
			return lineIndent < prev ? lineIndent : prev;

		}, null);

		// remove leading or trailing blank lines
		lines = lines.filter((line, index) => {
			if (index === 0 || index === lines.length - 1) return !/^\s*$/.test(line);
			return true;
		});

		return lines.map(function(l) {
			return l.substr(indent);
		}).join('\n');
	}

	_updateCode(slot) {
		const nodes = slot.assignedNodes();
		if (nodes.length === 0) {
			this.shadowRoot.querySelector('code.language-html').innerHTML = '';
			return;
		}
		const tempContainer = document.createElement('div');
		for (var i = 0; i < nodes.length; i++) {
			tempContainer.appendChild(nodes[i].cloneNode(true));
		}

		const html = Prism.highlight(this._unIndent(tempContainer.innerHTML), Prism.languages.html, 'html');
		this._codeHTML = html;
	}

}

customElements.define('demo-transfigurator', DemoTransfigurator);
