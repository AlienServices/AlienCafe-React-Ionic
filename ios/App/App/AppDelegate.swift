import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
 

    func applicationWillResignActive(_ application: UIApplication) {
        // Handle when app is about to become inactive
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Handle when app enters background
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Handle when app returns to foreground
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart tasks when app becomes active
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Handle when app is about to terminate
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}
