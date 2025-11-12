## Desktop Headless Widget
## Automatically pause recordings on answering a call - Pauses for the duration configured in CH

This is a simple headless widget to immediately pause recordings on answering a call.
Note: The recording resumes after the duration configured under CH recording settings. 

## Vidcast [Demo - Auto pause recordings](https://app.vidcast.io/share/ab172a47-5b7c-4097-b2a0-0a19854e1e13)

## Try this headless widget from local env

How to run the sample widget:

**Step 1:**

_To use this widget sample, we can run it from localhost_

- Inside this project on your terminal type: `npm install`
- Then inside this project on your terminal type: `npm run dev`
- This should run the app on your localhost:3001

**Step 2:**

_Add the widget to desktop from the shared layout:_

- Download the **pauseRecording.json_** file.
- Save the layout and upload & assign to the team layout via Control Hub or Admin Portal
- Note: Layouts are configured per Agent Team.
- Sign in to Agent Desktop with the team assigned the above layout. 
- Answer an incoming call to verify recording is paused. 

_Manually update the agent team layout_

- Copy the below code to the `area` section of desktop layout under `agent` and / or `supervisorAgent` profiles. Refer the shared layout.

```
"headless": {
    "id": "dw-headless",
    "widgets": {
        "comp1": {
            "comp": "pause-recording",
            "script":"http://localhost:3001/build/pause-recording.js"
        }
    },
    "layout": {
        "areas": [["comp1"]],
        "size": { "cols": [1], "rows": [1] }
    }
},
```


## Improve the widget:

- You can modify the widget as required.
- To create a new compiled JS file, execute the command `npm run build` which will create the new compiled widget under `.src/build/pause-recording.js`.
- You may rename this file, host it on your server of choice, and use host link under `script` in the layout.

## Useful Links - Supplemental Resources

[Desktop JS SDK Official Guide](https://developer.webex-cx.com/documentation/guides/desktop)

['Edit a Desktop Layout' section in the Administration Guide](https://help.webex.com/en-us/article/n5595zd/Webex-Contact-Center-Setup-and-Administration-Guide)

[Desktop Widgets Live Demo](https://ciscodevnet.github.io/webex-contact-center-widget-starter/)

## Disclaimer

> This is just a sample POC widget to demo the headless widget.
> This demo showcases the possibilities of Desktop SDK and helps to identify & implement use cases. 
.