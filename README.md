# EVChargeLocator
A mobile app for finding EV charging location near you


This app is built using React-Native. First the users location is determined. I used the Open charge map api (https://openchargemap.org/site/develop/api) to get charging stations near the users locations. The locations are then display on a MapView and marked with markers. Clicking on a marker displays address info about the locaiton. Click on the address info will open google maps for directions to the site. 


Currently there are a couple of bugs that I am working to fix. One being that the map markers do not appear when the app first loads and appear after a refresh.
