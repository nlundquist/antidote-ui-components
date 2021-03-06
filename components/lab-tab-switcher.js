import {html} from 'lit-html';
import {useContext, useEffect, component} from 'haunted';
import {LabTabsContext} from '../contexts.js';
import debounce from '../helpers/debounce.js';
import getComponentStyleSheetURL from '../helpers/stylesheet';

function setSelectedPresentation(id) {
  // takes a tab label element, sends a change event and updates the `selected` attribute
  this.dispatchEvent(new CustomEvent('antidote-tab-change', {
    bubbles: false, // prevents the event from bubbling up through the DOM
    composed: false, // prevents the event from crossing the Shadow DOM boundary
    detail: { id } // all data you wish to pass must be in `detail`
  }));
  const tabs = Array.from(this.shadowRoot.querySelectorAll(':host > ul > li'));
  const tabEl = this.shadowRoot.getElementById(id);
  tabs.forEach((t) => t.removeAttribute('selected'));
  tabEl.setAttribute('selected', '');
}

function deselectGuideTab() {
  const selectedTab = this.shadowRoot.querySelector('li[selected]');
  if (selectedTab.id === 'mobile-guide') {
    const otherTab = selectedTab.nextElementSibling || selectedTab.previousElementSibling;
    this.setSelectedPresentation(otherTab.id);
  }
}

const onResize = debounce(function onResize() {
  if (window.outerWidth > 1023) {
    deselectGuideTab.apply(this);
  }
}, 50);

function LabTabSwitcher() {
  const tabs = useContext(LabTabsContext);

  Object.assign(this, { setSelectedPresentation });

  // deselect guide tab if we shrink to the point that we show the large guide
  useEffect(() => {
    const handler = onResize.bind(this);
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    }
  }, []);

  // This template previously used the presence of tab.pres to determine if the presentation
  // type should be embedded in the h3 element for the tab. We've removed this for simplicity, but if this
  // is desired again, see the history here for a good way to do it. It's safe to do it here since it's only
  // used for the innerText of the h3 and not as the tab ID. For me, it was just an aesthetic thing.
  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <ul>
      ${tabs.map((tab) => html`
        <li id=${tab.id}
            @click=${() => this.setSelectedPresentation(tab.id)}
            ?selected=${tab.selected}>
          <h3>${tab.label}</h3>          
        </li>
      `)}
    </ul>
  `
}

customElements.define('antidote-lab-tab-switcher', component(LabTabSwitcher));

export default LabTabSwitcher;
