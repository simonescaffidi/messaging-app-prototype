// Aggiunge google-services.json (notifiche push Android) solo se fornito come
// variabile file di EAS: eas env:create --name GOOGLE_SERVICES_JSON --type file ...
module.exports = ({ config }) => ({
  ...config,
  android: { ...config.android, ...(process.env.GOOGLE_SERVICES_JSON ? { googleServicesFile: process.env.GOOGLE_SERVICES_JSON } : {}) }
});
