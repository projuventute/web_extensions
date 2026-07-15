// window.console.log('     widget core start');

function signalRnwCoreReady() {
  window.dispatchEvent(new Event("raisenow-core-ready"));
}

if (window.rnw && window.rnw.tamaroCore) {
  signalRnwCoreReady();
} else {
  var widgetCore = document.querySelector('script[data-widget="rnw-tamaro-core"]');

  if (!widgetCore) {
    widgetCore = document.createElement("script");
    widgetCore.setAttribute("src", "https://cdn.jsdelivr.net/npm/@raisenow/tamaro-core@2/dist/index.js");
    widgetCore.setAttribute("data-widget", "rnw-tamaro-core");
    document.head.append(widgetCore);
  }

  widgetCore.addEventListener("load", signalRnwCoreReady, { once: true });
  widgetCore.addEventListener("error", function (event) {
    window.console.error("[raiseNow widget core] failed to load", event);
  }, { once: true });
}

// window.console.log('     widget core complete');
