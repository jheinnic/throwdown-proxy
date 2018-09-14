// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseAppUrl: 'http://portfolio.dev.jchein.name:4200',
  keycloakConfigPath: '/assets/keycloak.json',
  keycloakServerUrl: 'http://portfolio.dev.jchein.name:28080/auth',
  onLoginRedirectUrl: '/route-one',
  onRegisterRedirectUrl: '/route-one',
  onLogoutRedirectUrl: '/route-two',
  cloudinaryCloudName: 'dwcg6g6c7',
  cloudinaryUploadPreset: 'MyPreset',
  cloudinaryBaseDeliveryUrl: 'http://res.cloudinary.com/dwcg6g6c',
  apolloGraphQueryUrl: 'http://www.cnn.com',
  neo4jGraphQueryUrl: 'http://www.cnn.com'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
