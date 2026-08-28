// window.console.log('     widget core start');

var widgetContainer = document.getElementsByClassName("rnw-widget-container")[0];

if (widgetContainer) {
  // add the widget core
  var widgetCore = document.createElement("script");
  widgetCore.setAttribute("src", "https://tamaro.raisenow.com/projuventute/latest/widget.js");
  widgetContainer.append(widgetCore);
} else {
  window.console.log("[raiseNow widget core] -> warning: .rnw-widget-container not found");
}

// window.console.log('     widget core complete');
