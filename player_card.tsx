import {h, Component} from 'preact';

import stopwatch from './images/jagex/Giant_stopwatch_detail.webp';
import defaultImage from './images/jagex/default_bot.webp';

import ca_gm from './images/jagex/Combat_Achievements_-_grandmaster_tier_icon.webp';
import ca_master from './images/jagex/Combat_Achievements_-_master_tier_icon.webp';
import ca_elite from './images/jagex/Combat_Achievements_-_elite_tier_icon.webp';
import ca_hard from './images/jagex/Combat_Achievements_-_hard_tier_icon.webp';
import ca_med from './images/jagex/Combat_Achievements_-_medium_tier_icon.webp';
import ca_easy from './images/jagex/Combat_Achievements_-_easy_tier_icon.webp';

import acheive_quiver from './images/jagex/1280px-Dizana\'s_quiver_detail.webp';
import acheive_cape from './images/jagex/1280px-Infernal_cape_detail.webp';

import mega_bow from './images/jagex/1280px-Twisted_bow_detail.webp';
import mega_staff from './images/jagex/Tumeken\'s_shadow_detail.webp';
import mega_scythe from './images/jagex/Scythe_of_vitur_detail.webp';

import type_unknown from './images/jagex/Cake_of_guidance_detail.webp';
import type_main from './images/jagex/Coins_detail.webp';
import type_iron from './images/jagex/800px-Ironman_helm_detail.webp';
import type_hcim from './images/jagex/120px-Hardcore_ironman_helm_detail.webp';
import type_uim from './images/jagex/800px-Ultimate_ironman_helm_detail.png';
import type_gim from './images/jagex/800px-Group_ironman_helm_detail.webp';
import type_hcgim from './images/jagex/Hardcore_group_ironman_helm_detail.webp';
import type_ugim from './images/jagex/800px-Group_ironman_helm_(unranked)_detail.webp';
import type_snowflake from "./images/snowflake.jpeg";

class PlayerCard extends Component {
    render(props:any, state:any) {
        let level = 2009;
        let username = "YuukiVsCG";
        let account_type = "IRON";
        let account_type_ico = type_unknown;

        if (account_type === "MAIN")
        {
            account_type_ico = type_main;
        }
        else if (account_type === "IRON")
        {
            account_type_ico = type_iron;
        }
        else if (account_type === "HCIM")
        {
            account_type_ico = type_hcim;
        }
        else if (account_type === "UIM")
        {
            account_type_ico = type_uim;
        }
        else if (account_type === "GIM")
        {
            account_type_ico = type_gim;
        }
        else if (account_type === "HCGIM")
        {
            account_type_ico = type_hcgim;
        }
        else if (account_type === "UGIM")
        {
            account_type_ico = type_ugim;
        }
        else if (account_type === "SNOWFLAKE")
        {
            account_type_ico = type_snowflake;
        }

        let ca_score = 500;
        let ca_icon = ca_easy;

        if (ca_score >= 148)
        {
            ca_icon = ca_med;
        }

        if (ca_score >= 394)
        {
            ca_icon = ca_hard;
        }

        if (ca_score >= 1026)
        {
            ca_icon = ca_elite;
        }

        if (ca_score >= 1841)
        {
            ca_icon = ca_master;
        }

        if (ca_score >= 2525)
        {
            ca_icon = ca_gm;
        }
        
        return (<div className="card border-secondary mb-3" style="width: 300px;">
                <div className="card-header">
                    <div className="row text-center align-items-center">
                        <div className="col-3 align-self-start">
                        Total:
                        <br/>
                            <span className="badge text-bg-success rounded-circle">
                                {level}
                            </span>
                        </div>
                        <div className="col badge text-bg-secondary">
                            <h4>{username}</h4>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <img src={defaultImage} style="max-width: 280px;"/>
                </div>
                <div className="card-body">
                    <div className="row text-center align-items-center">
                        <div className="col-sm-6">
                            <div className="row text-center align-items-center">
                                <div className="col">
                                    <img src={stopwatch} style="max-width: 40px;"/>
                                </div>
                                <div className="col text-center align-items-center">
                                    <div className="row text-center badge text-bg-primary">
                                        <h5>EST</h5>
                                    </div>
                                    <div className="row text-bg-secondary rounded">
                                        40-50 hours
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="row align-items-center">
                                <img src={ca_icon} style="width: 60px; height: 40px;"/>
                                {ca_score}
                            </div>
                            <div className="row align-items-center">
                                <img src={account_type_ico} style="max-width:60px;"/>
                                {account_type}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-2">
                            <img src={acheive_quiver} style="max-width:40px;"/>
                        </div>
                        <div className="col-2">
                            <img src={acheive_cape} style="max-width:40px;"/>
                        </div>
                        <div className="col-2">
                            <img src={mega_scythe} style="max-width:40px;"/>
                        </div>
                        <div className="col-2">
                            <img src={mega_staff} style="max-width:40px;"/>
                        </div>
                        <div className="col-2">
                            <img src={mega_bow} style="max-width:40px;"/>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    SOME NOTES FROM THE USER
                </div>
            </div>);
    }
}

export default PlayerCard;