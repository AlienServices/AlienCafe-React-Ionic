import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonPage,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, beer, diamondOutline, giftOutline, flameOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Login from './pages/Login'
import Create from './pages/Create'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonPage>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact={true} path="/tab1" render={() => <Login />}></Route>
          <Route exact={true} path="/" render={() => <Login />}></Route>
          <Route exact={true} path="/tab2" render={() => <Tab2 />}></Route>
          <Route exact={true} path="/tab3" render={() => <Tab3 />}></Route>          
          <Route exact={true} path="/create" render={() => <Create />}></Route>          
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={beer} />
            <IonLabel>Login</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={diamondOutline} />
            <IonLabel>All Posts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={giftOutline} />
            <IonLabel>My Posts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/create">
            <IonIcon aria-hidden="true" icon={flameOutline} />
            <IonLabel>Create A Post</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonPage>
);

export default App;
