# catalyst
A library for rapidly creating React MUI Apps quickly

The library exposts a few APIs that help create a react application quickly, using the same constant structure:
* The application always have a few application level contexts, including
  * Loading context, which controls a boolean `loading` value, defining weather the page is loading or not.
  * Theme context, allowing the user to define a theme at the application level.
  * optional Realm Application context, allowing to log in and manipulate Realm data. Data contexts that are added by the user will be linked to the realm app if one is found.
* A Menu and pages API, allowing to quickly creating UI for side, bottom and top menus
* An Input and Forms API, allowing for the quick creation of forms and inputs of various types.
* A bunch of helpers including force-update, and memory caching heleprs.
* Prebuilt components to wrap some of the MUI components, including a self-contained popup and dialog wrappers.