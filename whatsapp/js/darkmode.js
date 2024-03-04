class ThemeInterface {
  defaultId = undefined;
  defaultPosition = undefined;
  html = undefined; // should be one element
  style = undefined;
}

class ToggleFancyShapeTheme extends ThemeInterface {
  defaultId = "adm-toggle";
  defaultPosition = `
      position:fixed;
      bottom:8%;
      right:0;
      z-index: 0;
      display:none;
    `;

  html = `<div>
      <input id="darkmode-toggle" type="checkbox">
      <label for="darkmode-toggle">Dark Mode</label>
    </div>`;
  style = `
    
    `;
}

class ToggleButtonShape {
  toggleElm = undefined;

  constructor({ html, style, js, defaultId, defaultPosition }) {
    this.html = html;
    this.style = style;
    this.js = js;
    this.defaultId = defaultId;
    this.defaultPosition = defaultPosition;
  }

  createStyleElement() {
    const styleElm = document.createElement("style");
    styleElm.innerHTML = this.style;

    return styleElm;
  }

  createToggleElement() {
    const div = document.createElement("div");
    div.innerHTML = this.html;

    return div.firstChild;
  }

  getInputElement() {
    if (!this.toggleElm) return;

    const selector = `#${this.defaultId} input[type='checkbox']`;
    const input = this.toggleElm.querySelector(selector);

    return input;
  }

  setChangeEvent(action) {
    const input = this.getInputElement();
    input.addEventListener("change", action);
  }

  dispatchChangeEvent = () => {
    const input = this.getInputElement();
    const event = new Event("change");

    //input.checked = !input.checked;
    input.dispatchEvent(event);
  };

  render() {
    const styleElm = this.createStyleElement();
    const toggleElm = this.createToggleElement();

    toggleElm.setAttribute("style", this.defaultPosition);
    toggleElm.setAttribute("id", this.defaultId);

    document.head.appendChild(styleElm);
    document.body.appendChild(toggleElm);

    this.toggleElm = toggleElm;
  }
}

class ToggleHistoryManager {
  localStorageFlag = "awesome-dark-mode-status";

  saveState(state) {
    // localStorage.setItem(this.localStorageFlag, state);
  }

  readState() {
    return extSettings['dark-mode'] || false;// JSON.parse(localStorage.getItem(this.localStorageFlag)) || false;
  }

  setPreviousState(buttonDispatchChange) {
    const isPreviousStatusChecked = this.readState();
    if (isPreviousStatusChecked) buttonDispatchChange();
  }
}

class ToggleAction {
  constructor(doubleRotatedElements) {
    this.history = new ToggleHistoryManager();

    this.rotatedElementsSelectors = [...new Set([
      "html", "img", "video",
      ...doubleRotatedElements,
    ])];

    this.isHue = true;
    this.cssRotateCode = `filter: invert(1)${this.isHue ? " hue-rotate(180deg)" : ""
      } !important`;
  }

  rotateElmColor180deg(elm) {
      const cssCode = this.cssRotateCode;
      const elmCSSRules = elm.style.cssText
        .split(";")
        .map((elm) => elm.trim())
        .filter((elm) => elm);
      // toggle css code
      elmCSSRules.includes(cssCode)
        ? elmCSSRules.splice(elmCSSRules.indexOf(cssCode), 1)
        : elmCSSRules.push(cssCode);

      elm.style.cssText = elmCSSRules.join(";");
  }

  rotateElementsColor() {
    this.rotatedElementsSelectors.forEach((selector) =>
      document
        .querySelectorAll(selector)
        .forEach((elm) => this.rotateElmColor180deg(elm))
    );
  }

  onChangeEvent = (e) => {
    this.rotateElementsColor();
    this.history.saveState(e.target.checked);
  };
}

class AutoDarkMode {
  constructor(themeInstance, doubleRotatedElements) {
    const buttonTheme = themeInstance || new ToggleFancyShapeTheme();

    const button = new ToggleButtonShape(buttonTheme);
    const history = new ToggleHistoryManager();
    const action = new ToggleAction(doubleRotatedElements || []);

    const { onChangeEvent } = action;
    const { dispatchChangeEvent } = button;

    button.render();
    button.setChangeEvent(onChangeEvent);

    history.setPreviousState(dispatchChangeEvent);
  }
}


if (typeof exports != "undefined") module.exports = AutoDarkMode;


if (!window.location.href.endsWith('#reader')) {
  setTimeout(function () {
    var adm = new AutoDarkMode();
  }, 500);
}
