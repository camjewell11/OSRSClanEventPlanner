import 'bootstrap';
import {h, render} from 'preact';
import PlayerCard from './player_card';

const app = document.getElementById("app");
if (app != null)
{
    render(<PlayerCard level={32} account_type={"MAIN"} username={"test"} ca_score={0} hours={"40 - 50"} timezone ={"EST"}></PlayerCard>, app);
}