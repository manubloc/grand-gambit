// SSR smoke: render every screen with realistic profiles to surface runtime errors.
import { renderToStaticMarkup } from "react-dom/server";
import App, { PlayHub } from "./src/app/App.jsx";
import { CampaignScreen } from "./src/app/ui/screens/CampaignScreen.jsx";
import { ArmyScreen } from "./src/app/ui/screens/ArmyScreen.jsx";
import { GameScreen } from "./src/app/ui/screens/GameScreen.jsx";
import { AchievementsScreen } from "./src/app/ui/screens/AchievementsScreen.jsx";
import { ProfileScreen } from "./src/app/ui/screens/ProfileScreen.jsx";
import { Splash, Wordmark } from "./src/app/ui/Brand.jsx";
import { OnlineScreen } from "./src/app/ui/screens/OnlineScreen.jsx";
import { LoginScreen } from "./src/app/ui/screens/LoginScreen.jsx";
import { SavesScreen } from "./src/app/ui/screens/SavesScreen.jsx";
import { LeaderboardSection } from "./src/app/ui/screens/LeaderboardScreen.jsx";
import { createNet } from "./src/platform/net.web.js";
import { defaultProfile, buildStageMatch, advanceCampaign } from "./src/meta/index.js";
import { makeT } from "./src/app/i18n/strings.js";

const t = makeT("de");
let prof = defaultProfile();
const legacy = { v: 1, xp: 777, charXp: { pawn: 300, knight: 120 }, campaign: { cleared: 3 }, loadout: {}, stats: {} };

const step = (name, fn) => { try { fn(); console.log("  ok  -", name); } catch (e) { console.log(" FAIL -", name, "→", e.message); console.log(e.stack.split("\n").slice(0,4).join("\n")); } };

step("Splash renders", () => renderToStaticMarkup(<Splash onDone={() => {}} />));
step("Wordmark renders", () => renderToStaticMarkup(<Wordmark />));
step("App initial render", () => renderToStaticMarkup(<App />));
step("LoginScreen renders", () => renderToStaticMarkup(<LoginScreen onSignedIn={() => {}} />));
step("SavesScreen renders", () => renderToStaticMarkup(<SavesScreen account={{ id: "t1", name: "Tester", isAdmin: true }} onOpen={() => {}} onLogout={() => {}} />));
step("LeaderboardSection renders", () => renderToStaticMarkup(<LeaderboardSection profile={prof} playtimeSec={4200} />));
step("PlayHub", () => renderToStaticMarkup(<PlayHub profile={prof} t={t} onQuick={() => {}} onCamp={() => {}} />));
step("CampaignScreen (fresh)", () => renderToStaticMarkup(<CampaignScreen profile={prof} t={t} onStart={() => {}} />));
prof = advanceCampaign(advanceCampaign(advanceCampaign(prof, "n01"), "n02"), "n03");
step("CampaignScreen (forked)", () => renderToStaticMarkup(<CampaignScreen profile={prof} t={t} onStart={() => {}} />));
step("ArmyScreen", () => renderToStaticMarkup(<ArmyScreen profile={prof} dispatch={() => {}} t={t} />));
step("GameScreen quick play", () => renderToStaticMarkup(<GameScreen profile={prof} dispatch={() => {}} t={t} />));
step("GameScreen campaign piece-boss", () => renderToStaticMarkup(<GameScreen profile={prof} dispatch={() => {}} t={t} match={buildStageMatch("a2")} onExit={() => {}} />));
step("OnlineScreen (disconnected)", () => renderToStaticMarkup(<OnlineScreen profile={prof} dispatch={() => {}} t={t} net={createNet()} onMatch={() => {}} />));
step("AchievementsScreen", () => renderToStaticMarkup(<AchievementsScreen profile={prof} t={t} />));
step("ProfileScreen", () => renderToStaticMarkup(<ProfileScreen profile={prof} dispatch={() => {}} t={t} />));
console.log("done");
