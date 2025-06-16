import 'bootstrap';
import {h, render} from 'preact';
import PlayerCard from './player_card';

const app = document.getElementById("app");
if (app != null)
{
    render(<PlayerCard></PlayerCard>, app);
}