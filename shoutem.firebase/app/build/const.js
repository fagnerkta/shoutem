/* eslint-disable max-len */
const androidPlugins = 'apply plugin: "com.google.gms.google-services"';
const androidDependencies = `
    compile project(':react-native-fcm')
    compile "com.google.firebase:firebase-core:\${rootProject.ext.firebaseVersion}"
    compile "com.google.firebase:firebase-messaging:\${rootProject.ext.firebaseVersion}"
`;

const appDelegateHeaderSearch = '@interface AppDelegate : UIResponder <UIApplicationDelegate>';
const appDelegateHeaderReplace = '@interface AppDelegate : UIResponder <UIApplicationDelegate, UNUserNotificationCenterDelegate>';
const iosDidFinishLaunchingWithOptions = `
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
`;
const iosAppDelegateBody = `
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
}

#if defined(__IPHONE_11_0)
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
#else
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
{
  [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
#endif

-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNFIRMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
`;

const firebase = {
  ios: {
    appDelegate: {
      import: '#import "RNFIRMessaging.h"',
      didFinishLaunchingWithOptions: iosDidFinishLaunchingWithOptions,
      body: iosAppDelegateBody,
    },
    appDelegateHeader: {
      import: '@import UserNotifications;',
      replace: [
        [appDelegateHeaderSearch, appDelegateHeaderReplace],
      ],
    },
  },
  android: {
    gradle: {
      app: {
        dependencies: androidDependencies,
        plugins: androidPlugins,
      },
    },
  },
};

module.exports = {
  firebase,
};
