<!-- - After receiving request on http://localhost:42049/overlays on ALT+F4 port 42049 keeps being in use and routes such as http://localhost:42049/overlays/ are kept being available + Sometimes main window is not closing from the first try on X mark click -->
- When APP starts it has to check if all subscribed overlays are downloaded
- There should be some status bar for all downloads in general
- When "Add Overlay" is clicked there must be displayed currently downloading overlay, if it is downloading and list of overlays must be updated in time
- Overlay Configurator must be done
- In workshop tab subscribed items must be marked as subscribed before clicked (on thumbnail)
- Edit Mode button must be appropriately styled
- In "Add Overlay", when it is open if list is empty there must be displayed a message "no overlays found" and link to "get more overlays"
<!-- - App version must be displayed on "title-bar" -->
- Implement safety features for overlays. (disable access to "unsigned" resources)
- Add visualization when Steam is online/connected
- Track steam connection, to automatically update page when Steam got open/closed both in Workshop tab and Create tab
<!-- - On "Close" / "X" button click application does not exit, main window + overlays closes only, but run keeps running in the background -->