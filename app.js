/**
 * Object constructor. Requires an object, which should contain keys userId and accessToken.
 * Optional object keys include domElementId and connectionId
 *
 * If domElementId is provided, control will try to attach to DOM element with that ID. Otherwise, it will attach itself to body.
 * If connectionId is provided, a login form will be prompted. Use this to update the login details for an existing connection - for example, when login password changes.
 *
 * @param demo          true if demo features are enabled
 * @param domElementId  ID of DOM element to attach
 * @param userId        user ID (required)
 * @param accessToken   basiq API access token (required)
 * @param connectionId  connection ID
 * @param blinkHost     host of basiq blink (defaults to "//js.basiq.io")
 * @param pdfUpload     pdf upload feature flag
 * @param institutionRegion show istituions from provided region; valid values are 'Australia', 'New Zealand'
 * @constructor
 */
let Basiq = function (data) {
  if (!data.demo && (!data.userId || !data.accessToken)) {
    throw new Error(
      "You need to pass the user id and access token to the control"
    );
  }

  function initializeDomElement(domElementId) {
    if (!domElementId) {
      try {
        return document.getElementsByTagName("body")[0];
      } catch (e) {
        throw new Error("No body element found in your document");
      }
    }
    return document.getElementById(domElementId);
  }

  let params = [
    "iframe=true",
    "user_id=" + data.userId,
    "access_token=" + data.accessToken
  ];
  if (data.demo === true) {
    params.push("demo=true");
  }
  if (data.connectionId) {
    params.push("connection_id=" + data.connectionId);
  }
  if (data.ignoreParsing) {
    params.push("ignore_parsing=true");
  }
  if (data.connect) {
    params.push("connect=true");
  }
  if (data.upload) {
    params.push("upload=true");
  }
  if(data.institutionRegion) {
    params.push("institution_region=" + data.institutionRegion);
  }

  let host = data.blinkHost ? data.blinkHost : "//js.basiq.io/";
  let page = data.statements === true ? "index2.html" : "index.html";
  let url = host + page + "?" + params.join("&");

  let self = this;
  self.domElement = initializeDomElement(data.domElementId);
  this.url = url;
  this.rendered = false;
  this.listeners = {};
  this.initialized = false;

  /**
   * Initialises postMessage listener
   *
   * @returns {Basiq}
   */
  let init = function () {
    let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent",
      eventer = window[eventMethod],
      messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

    eventer(messageEvent, function (e) {
      try {
        let data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;

        for (let event in self.listeners) {
          if (!self.listeners.hasOwnProperty(event)) {
            continue;
          }
          let cbs = self.listeners[event];

          if (event === data.event) {
            cbs.forEach(function (cb) {
              cb(data.payload, event);
            });
          }
        }
      } catch (error) {
        return;
      }
    });

    self.initialized = true;
    return self;
  };

  init();

  /**
   * Attaches a listener to an event emitted by the frame
   *
   * @param events Array
   * @param cb Function
   * @returns {Basiq}
   */
  this.addListener = function (events, cb) {
    if (typeof cb !== "function") {
      throw new Error("Passed callback must be a function");
    }

    if (!(events instanceof Array)) {
      events = [events];
    }

    events.forEach(function (event) {
      self.registerHandler(event, cb);
    });

    return self;
  };

  this.registerHandler = function (event, cb) {
    if (!self.listeners[event]) {
      self.listeners[event] = [];
    }

    self.listeners[event].push(cb);
  };

  /**
   * Shows the control
   *
   * @returns {Basiq}
   */
  this.show = function () {
    if (!self.rendered) {
      throw new Error("Component has not been rendered");
    }

    self.backdrop.style.cssText = "visibility: visible";

    return self;
  };

  /**
   * Hides the control
   *
   * @returns {Basiq}
   */
  this.hide = function () {
    if (!self.rendered) {
      throw new Error("Component has not been rendered");
    }

    self.backdrop.style.cssText = "visibility: hidden";

    return self;
  };

  /**
   * Destroys the control
   * @returns {Basiq}
   */
  this.destroy = function () {
    if (!self.rendered || !self.initialized) {
      throw new Error("Component has not been rendered");
    }

    self.domElement.removeChild(self.backdrop);
    self.backdrop = null;
    self.container = null;
    self.initialized = false;
    self.rendered = false;
    self.listeners = {};

    return self;
  };

  /**
   * Renders the control by attaching the backdrop div to the
   * given dom element
   *
   * @returns {Basiq}
   */
  this.render = function () {
    if (self.rendered === true) {
      self.show();

      return self;
    }

    let backdrop = document.createElement("div"),
      container = document.createElement("div"),
      iframe = document.createElement("iframe");

    self.backdrop = backdrop;
    self.container = container;
    self.backdrop.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; min-height: 450px; min-width: 307px; z-index: 100; background: rgba(0, 0, 0, 0.4);";
    self.container.style.cssText = "position: absolute; top: 50%; left: 50%; margin-left: -153px; margin-top: -225px; width: 307px; min-height: 450px; max-height: 520px; height: 100%; border-radius: 15px; z-index: 101; -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50); -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50); box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);";

    iframe.src = self.url;
    iframe.id = "basiq-modal-frame";
    iframe.frameBorder = "0";
    iframe.style.cssText = "width: 100%; height: 100%; border-radius: 15px;";

    backdrop.id = "basiq-modal-container-backdrop";
    container.id = "basiq-modal-container";
    container.appendChild(iframe);
    backdrop.appendChild(container);
    self.domElement.appendChild(backdrop);

    self.rendered = true;
    self.initialized = true;

    self.addListener(["cancellation", "completion"], function () {
      self.destroy();
    });

    return self;
  };
};

window.Basiq = Basiq;
