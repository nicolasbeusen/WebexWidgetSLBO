## Desktop Headless Widget
## Change State to Available after a RONA

This is a simple headless widget.
It helps change the change state to Available after a specific duration when agent state goes RONA.
The wait duration can be configured / changed from layout. 


## Try this headless widget from local env

How to run the sample widget:

**Step 1:**

_To use this widget sample, we can run it from localhost_

- Inside this project on your terminal type: `npm install`
- Then inside this project on your terminal type: `npm run dev`
- This should run the app on your localhost:3001

**Step 2:**

_Add the widget to desktop from the shared layout:_

- Download the **changeStateToAvailable.json** file.
- Update the `delaySeconds` to a required value (in seconds)
- Save the layout and upload & assign to the team layout via Control Hub or Admin Portal
- Note: Layouts are configured per Agent Team.

_Manually update the agent team layout_

- Copy the below code to the `area` section of desktop layout under `agent` and / or `supervisorAgent` profiles. Refer the shared layout.

```
"headless": {
    "id": "dw-headless",
    "widgets": {
        "comp1": {
            "comp": "change-rona",
            "script":"http://localhost:3001/build/change-rona.js",
            "properties": {
                "delaySeconds": "15"
            }
        }
    },
    "layout": {
        "areas": [["comp1"]],
        "size": { "cols": [1], "rows": [1] }
    }
},
```

**Note**: If the property `delaySeconds` is missing, then widget defaults to a 10 second timeout.


## Improve the widget:

- You can modify the widget as required.
- You may add additional logic to identify if the agent manually changes to Idle before the automatic change to Available.
- To create a new compiled JS file, execute the command `npm run build` which will create the new compiled widget under `.src/build/change-rona.js`.
- You may rename this file, host it on your server of choice, and use host link under `script` in the layout.

## Useful Links - Supplemental Resources

[Desktop JS SDK Official Guide](https://developer.webex-cx.com/documentation/guides/desktop)

['Edit a Desktop Layout' section in the Administration Guide](https://help.webex.com/en-us/article/n5595zd/Webex-Contact-Center-Setup-and-Administration-Guide)

[Desktop Widgets Live Demo](https://ciscodevnet.github.io/webex-contact-center-widget-starter/)

## Disclaimer

> This is just a sample POC widget to demo the headless widget and not meant to be production ready.
> This demo showcases the possibilities of Desktop SDK and helps to identify & implement use cases. 
