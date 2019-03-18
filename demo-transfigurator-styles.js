import { css } from 'lit-element/lit-element.js';

export const demoTransfiguratorStyles = css`
	:host {
		border: 1px solid #565a5c;
		border-radius: 6px;
		display: block;
	}
	:host([hidden]) {
		display: none;
	}
	:host .demo-transfigurator-demo {
		padding: 18px;
	}
	:host([no-padding]) .demo-transfigurator-demo {
		padding: 0;
	}
	pre[class*="language-"] {
		margin: 0;
		padding: 18px;
	}
`;
