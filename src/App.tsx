import { Redirect, Route } from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";
import {
  IonApp,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
  IonIcon,
  IonLabel,
  setupIonicReact,
} from "@ionic/react";
import { beer, search, flameOutline, giftOutline, diamondOutline } from "ionicons/icons";

import Tab2 from "./pages/tabs/Profile";
import Tab3 from "./pages/tabs/Homepage";
import Login from "./pages/Login";
import Create from "./pages/tabs/Create";
import Post from "./pages/View/[id]";
import MessageHome from "./pages/tabs/MessageHome";
import Chat from "./pages/messagePages/Chat";
import Quiz from "./subPages/Quiz";
import CurrentChat from "./pages/messagePages/CurrentChat";
import Comment from "./pages/Comment/[id]";
import Search from "./pages/tabs/Search";
import Profile from "./pages/Profile/[id]";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/" component={Login} />
          <Route exact path="/tab1" component={Tab3} />
          <Route exact path="/tab2" component={Tab2} />
          <Route exact path="/tab3" component={MessageHome} />
          <Route exact path="/create" component={Create} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/Comment/:id/:myVote/:postId" component={Comment} />
          <Route exact path="/quiz" component={Quiz} />
          <Route exact path="/newChat" component={Chat} />
          <Route exact path="/chat/:id" component={CurrentChat} />
          <Route exact path="/view/:id" component={Post} />
          <Route exact path="/profile/:id" component={Profile} />
          {/* <Redirect exact from="/" to="/tab1" /> */}
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={beer} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="search" href="/search">
            <IonIcon icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="create" href="/create">
            <IonIcon icon={flameOutline} />
            <IonLabel>Create</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon icon={giftOutline} />
            <IonLabel>Messages</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon icon={diamondOutline} />
            <IonLabel>My Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
