import 'bootstrap';
import PlayerCard from './player_card';
import * as ReactDOM from 'react-dom/client';

const app = document.getElementById("app");
if (app != null)
{
    const root = ReactDOM.createRoot(app);
    root.render(<PlayerCard level={2277} account_type={"MAIN"} username={"test"} ca_score={2525} hours={"40 - 50"} timezone ={"EST"} has_shadow={true} notes="test"></PlayerCard>, app);
}