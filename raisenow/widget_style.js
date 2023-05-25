// inject styles to page
var widgetStyleInnerText = `
   #tamaro-widget.tamaro-widget .btn-text {
   	text-transform: uppercase !important;
   }
   :root {
      --tamaro-block-header-position-color: white !important;
      --tamaro-primary-color: black !important;
      --tamaro-primary-color__hover: #f0eeeb !important;
      --tamaro-primary-bg-color: #fbbb21 !important;
      --tamaro-text-color: black !important;
      --tamaro-bg-color__hover: #f0eeeb !important;
      --tamaro-border-color: #f0eeeb !important;
      --tamaro-placeholder-color: black !important;
      --tamaro-info-text-color: black !important;
      --tamaro-info-icon-color: #fbbb21 !important;
      /*--tamaro-error-color*/
      --tamaro-button-color: #fbbb21 !important;
      --tamaro-button-color__hover: #f0eeeb !important;
      --tamaro-button-bg-color: #f0eeeb !important;
      --tamaro-button-bg-color__hover: #f0eeeb !important;
      --tamaro-button-border-color: #fbbb21 !important;
      --tamaro-button-border-color__hover: #f0eeeb !important;
      --tamaro-button-primary-color: black !important;
      --tamaro-button-primary-color__hover: black !important;
      --tamaro-button-primary-bg-color: #fbbb21 !important;
      --tamaro-button-primary-bg-color__hover: #f0eeeb !important;
      --tamaro-button-primary-border-color: #fbbb21 !important;
      --tamaro-button-primary-border-color__hover: #f0eeeb !important;
   }
   
   .rnw-widget-container {
        margin: auto !important;
        width: 100% !important;
        padding-bottom: 50px !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
   }
`;

// var widgetContainer = document.getElementsByClassName("rnw-widget-container")[0];

// var widgetStyle = document.createElement("style");
// widgetStyle.innerText = widgetStyleInnerText;
// widgetContainer.append(widgetStyle);

window.console.log('     widget style start');
document.head.innerHTML += '<style id="spendenwidget">' + widgetStyleInnerText + '</style>';
window.console.log('     widget style end');