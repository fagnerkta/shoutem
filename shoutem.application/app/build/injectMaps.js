const {
  getPodfileTemplatePath,
  getMainApplicationPath,
  getAppGradlePath,
  getSettingsGradlePath,
  getAndroidManifestPath,
  inject,
  replace,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');
const { maps } = require('./const');

// cwd for build steps is extension/app directory. we want to run this on project directory

function injectIos() {
  const podFileTemplatePath = getPodfileTemplatePath({ cwd: projectPath });

  // ios/Podfile.template mods
  // google maps libs don't support frameworks flag so we have to disable it
  replace(podFileTemplatePath, 'use_frameworks!', '# use_frameworks!');
  inject(podFileTemplatePath, ANCHORS.IOS.PODFILE.EXTENSION_DEPENDENCIES, maps.ios.podfile.pods);
  inject(podFileTemplatePath, ANCHORS.IOS.PODFILE.EXTENSION_POSTINSTALL_TARGETS, maps.ios.podfile.podTargets);
}

function injectAndroid() {
  // app/build.gradle mods
  const appGradlePath = getAppGradlePath({ cwd: projectPath });
  inject(appGradlePath, ANCHORS.ANDROID.GRADLE.APP.DEPENDENCIES, maps.android.gradle.app.dependencies);

  // settings.gradle mods
  const settingsGradlePath = getSettingsGradlePath({ cwd: projectPath });
  inject(settingsGradlePath, ANCHORS.ANDROID.GRADLE.SETTINGS, maps.android.gradle.settings);

  // MainApplication.java mods
  const mainApplicationPath = getMainApplicationPath({ cwd: projectPath });
  inject(mainApplicationPath, ANCHORS.ANDROID.MAIN_APPLICATION.IMPORT, maps.android.mainApplication.import);
  inject(mainApplicationPath, ANCHORS.ANDROID.MAIN_APPLICATION.GET_PACKAGES, maps.android.mainApplication.getPackage);

  // AndroidManifest.xml mods
  const androidManifestPath = getAndroidManifestPath({ cwd: projectPath });
  inject(androidManifestPath, ANCHORS.ANDROID.MANIFEST.APPLICATION, maps.android.manifest);
}

/**
 * Injects required modifications for react-native-maps package as described
 * here: https://github.com/react-community/react-native-maps/blob/master/docs/installation.md
 *
 * This must be run before pod install step
 */
function injectMaps() {
  injectIos();
  injectAndroid();
}

module.exports = injectMaps;
