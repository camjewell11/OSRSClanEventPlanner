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

interface PlayerCardProps {
    level: number;
    account_type: string;
    ca_score: number;
    username: string;
    timezone: string;
    hours: string;
    notes: string;
    has_shadow: boolean;
    has_tbow: boolean;
    has_scythe: boolean;
    has_quiver: boolean;
    has_infernal: boolean;
};

class PlayerCard extends Component {

    constructor(props: PlayerCardProps) {
        super(props);
    }
    render(props:any, state:any) {
        let account_type_ico = type_unknown;

        if (props.account_type === "MAIN")
        {
            account_type_ico = type_main;
        }
        else if (props.account_type === "IRON")
        {
            account_type_ico = type_iron;
        }
        else if (props.account_type === "HCIM")
        {
            account_type_ico = type_hcim;
        }
        else if (props.account_type === "UIM")
        {
            account_type_ico = type_uim;
        }
        else if (props.account_type === "GIM")
        {
            account_type_ico = type_gim;
        }
        else if (props.account_type === "HCGIM")
        {
            account_type_ico = type_hcgim;
        }
        else if (props.account_type === "UGIM")
        {
            account_type_ico = type_ugim;
        }
        else if (props.account_type === "SNOWFLAKE")
        {
            account_type_ico = type_snowflake;
        }

        let ca_icon = ca_easy;

        if (props.ca_score >= 148)
        {
            ca_icon = ca_med;
        }

        if (props.ca_score >= 394)
        {
            ca_icon = ca_hard;
        }

        if (props.ca_score >= 1026)
        {
            ca_icon = ca_elite;
        }

        if (props.ca_score >= 1841)
        {
            ca_icon = ca_master;
        }

        if (props.ca_score >= 2525)
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
                                {props.level}
                            </span>
                        </div>
                        <div className="col badge text-bg-secondary">
                            <h4>{props.username}</h4>
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
                                        <h5>{props.timezone}</h5>
                                    </div>
                                    <div className="row text-bg-secondary rounded">
                                        {props.hours} hours
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="row align-items-center">
                                <img src={ca_icon} style="width: 60px; height: 40px;"/>
                                {props.ca_score}
                            </div>
                            <div className="row align-items-center">
                                <img src={account_type_ico} style="max-width:60px;"/>
                                {props.account_type}
                            </div>
                        </div>
                    </div>
                </div>
                {props.has_quiver || props.has_infernal || props.has_scythe || props.has_tbow || props.has_shadow ? <div className="card-body">
                    <div className="row align-items-center">
                        {props.has_quiver ? <div className="col-2">
                            <img src={acheive_quiver} style="max-width:40px;"/>
                        </div> : {}}
                        {props.has_infernal ? <div className="col-2">
                            <img src={acheive_cape} style="max-width:40px;"/>
                        </div> : {}}
                        {props.has_scythe ? <div className="col-2">
                            <img src={mega_scythe} style="max-width:40px;"/>
                        </div> : {}}
                        {props.has_shadow ? <div className="col-2">
                            <img src={mega_staff} style="max-width:40px;"/>
                        </div> : {}}
                        {props.has_tbow ? <div className="col-2">
                            <img src={mega_bow} style="max-width:40px;"/>
                        </div> : {}}
                    </div>
                </div> : {}}
                <div className="card-body">
                    {props.notes}
                </div>
            </div>);
    }
}

export default PlayerCard;