// Aggiunge google-services.json (notifiche push Android) solo se fornito come
// variabile file di EAS: eas env:create --name GOOGLE_SERVICES_JSON --type file ...
// Play richiede targetSdk 36: Gradle/AGP di RN 0.74 va avvisato che e' supportato.
const { withGradleProperties } = require('expo/config-plugins');
const withSdk36 = (config) => withGradleProperties(config, (c) => {
  c.modResults = c.modResults.filter((i) => i.key !== 'android.suppressUnsupportedCompileSdk');
  c.modResults.push({ type: 'property', key: 'android.suppressUnsupportedCompileSdk', value: '36' });
  return c;
});
module.exports = ({ config }) => withSdk36({
  ...config,
  android: { ...config.android, ...(process.env.GOOGLE_SERVICES_JSON ? { googleServicesFile: process.env.GOOGLE_SERVICES_JSON } : {}) }
});
