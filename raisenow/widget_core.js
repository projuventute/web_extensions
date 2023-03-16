window.console.log('     widget core start');

var widgetContainer = document.getElementsByClassName("rnw-widget-container")[0];

// add the widget core
var widgetCore = document.createElement("script");
widgetCore.setAttribute("src", "https://tamaro.raisenow.com/projuventute/latest/widget.js");
widgetCore.setAttribute("defer", ""); // script is added after DOM-ready => to execute it, defer!
widgetContainer.append(widgetCore);

window.console.log('     widget core complete');