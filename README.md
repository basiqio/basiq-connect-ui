# Basiq Connect UI

## Example

You can see an example implementation in the index.html file and the demo application

```https://js.basiq.io/demo/index.html```


To login to any institution successfully use the following credentials

```
username: username_valid
password: password_valid
```

## Introduction

This example will explain the basic implementation of Basiq Connect UI service into your web application
using our JS client. The JS client will display a modal window centered in the viewport,
which will allow the user to connect to their bank account. The focus of the developer is on the
business logic, not on the implementation details.

## Setup

Include the ```basiq.client.min.js``` into your web page.

```html
<script src="https://js.basiq.io/v1/basiq.client.min.js"></script>
```

To instantiate the Basiq client object you need to have access_token and user_id available.

### Usage

#### Connect to bank account

Attach onclick function to an element:

```js
document.getElementById("connectYourAcc").onclick = function () {
    // Initialization code goes here.
    // Event listeners also goes here.
};
```

Inside onlick function (initialization code), create a new Basiq instance:

```js
var ui = new Basiq({
    userId,
    accessToken
});
```

Now you are ready to display the web application. You can do that by invoking the ```render()``` method.
The most common use case will be opening the modal window. Complete code should look like this:

```js
document.getElementById("connectYourAcc").onclick = function () {
    var ui = new Basiq({
        userId,
        accessToken
    });

    ui.render();
};
```

#### Update login credentials

Create a new Basiq instance, while providing Basiq's UserID and ConnectionID that you received when initially connecting this user:

```js
var ui = new Basiq({
    userId,
    connectionId,
    accessToken
});
```

After that, invoke the ```render()``` method, as usual.

### Listening for events

You can listen and react to all events emitted by the web app by using the ```addListener(event, cb)``` method.
Multiple listeners per event are supported. The basic events you should always react to
 are *connection* and *cancellation*.

Function signature for event callbacks is ```(payload, event)```

```js
ui.addListener("connection", function (payload) {
    console.log("Connection:", payload);
    ui.destroy();
});

ui.addListener("completion", function () {
    ui.destroy();
});

ui.addListener("cancellation", function () {
    ui.hide();
});
```

You can also pass in an array of events with the callback.

```js
ui.addListener(["completion", "cancellation"], function () {
    ui.destroy();
});
```

### Available events

Event | When is it triggered | Callback data
--- | --- | ---
```handshake``` | When a handshake is established | {success: true}
```job``` | When a job is created | {success: [bool], data: { id: [string]}}
```connection``` | When a connection is created/updated | {success: [bool], data: { id: [string]}}
```cancellation``` | When a user has closed the modal form  | null
```completion``` | When a user has completed the process by clicking on "Done" | null

The callbacks receive the event payload which can be used to track user's progress and
react to user's actions. The most important event is the ```connection```, which indicates the user
has completed the connection process and which returns the connection id, which can be
used to fetch user's bank data.

### Resetting the web app state

We have exposed the ```destroy()``` method to allow the web app to be detached from DOM and
to reset its state. This allows the clients implementing it to be flexible.