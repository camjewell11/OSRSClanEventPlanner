import stopwatch from './images/jagex/Giant_stopwatch_detail.webp';
import defaultImage from './images/jagex/default_bot.webp';

import ca_gm from './images/jagex/Combat_Achievements_-_grandmaster_tier_icon.webp';
import ca_master from './images/jagex/Combat_Achievements_-_master_tier_icon.webp';
import ca_elite from './images/jagex/Combat_Achievements_-_elite_tier_icon.webp';
import ca_hard from './images/jagex/Combat_Achievements_-_hard_tier_icon.webp';
import ca_med from './images/jagex/Combat_Achievements_-_medium_tier_icon.webp';
import ca_easy from './images/jagex/Combat_Achievements_-_easy_tier_icon.webp';

import achieve_quiver from './images/jagex/1280px-Dizana\'s_quiver_detail.webp';
import achieve_cape from './images/jagex/1280px-Infernal_cape_detail.webp';

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
import React from 'react';

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

let accountTypes = new Map<string, any>();
accountTypes.set("MAIN", type_main);
accountTypes.set("IRON", type_iron);
accountTypes.set("HCIM", type_hcim);
accountTypes.set("UIM", type_uim);
accountTypes.set("GIM", type_gim);
accountTypes.set("HCGIM", type_hcgim);
accountTypes.set("UGIM", type_ugim);
accountTypes.set("SNOWFLAKE", type_snowflake);

let caIcons = new Map<number, any>();
caIcons.set(2525, ca_gm);
caIcons.set(1841, ca_master);
caIcons.set(1026, ca_elite);
caIcons.set(394, ca_hard);
caIcons.set(148, ca_med);


const achievementIcons = [
    { prop: "has_quiver", img: achieve_quiver },
    { prop: "has_infernal", img: achieve_cape },
    { prop: "has_scythe", img: mega_scythe },
    { prop: "has_shadow", img: mega_staff },
    { prop: "has_tbow", img: mega_bow },
];
class PlayerCard extends React.Component<PlayerCardProps> {
    constructor(props: PlayerCardProps) {
        super(props);
    }
    override render() {
        let account_type_ico = type_unknown;

        if (accountTypes.has(this.props.account_type)) {
            account_type_ico = accountTypes.get(this.props.account_type);
        }

        let ca_icon = ca_easy;

        for (const [minPoints, ico] of caIcons) {
            if (this.props.ca_score >= minPoints) {
                ca_icon = ico;
                break;
            }
        }

        const activeAchievements = achievementIcons.filter(icon => (this.props as any)[icon.prop]);

        return (
        <div className="card border-secondary mb-3" style={{width: 300+"px"}}>
            <div className="card-header">
                <div className="row text-center align-items-center">
                    <div className="col-3 align-self-start">
                    Total:
                    <br/>
                        <span className="badge text-bg-success rounded-circle">
                            {this.props.level}
                        </span>
                    </div>
                    <div className="col badge text-bg-secondary">
                        <h4>{this.props.username}</h4>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <img src={defaultImage} style={{maxWidth: 280+"px"}}/>
            </div>
            <div className="card-body">
                <div className="row text-center align-items-center">
                    <div className="col-sm-6">
                        <div className="row text-center align-items-center">
                            <div className="col">
                                <img src={stopwatch} style={{maxWidth: 40+"px"}}/>
                            </div>
                            <div className="col text-center align-items-center">
                                <div className="row text-center badge text-bg-primary">
                                    <h5>{this.props.timezone}</h5>
                                </div>
                                <div className="row text-bg-secondary rounded">
                                    {this.props.hours} hours
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="row align-items-center">
                            <img src={ca_icon} style={{width: 60+"px", height: 40+"px"}}/>
                            {this.props.ca_score}
                        </div>
                        <div className="row align-items-center">
                            <img src={account_type_ico} style={{maxWidth:60+"px"}}/>
                            {this.props.account_type}
                        </div>
                    </div>
                </div>
            </div>

            {activeAchievements.length > 0 && (
                    <div className="card-body">
                        <div className="row align-items-center">
                            {activeAchievements.map((icon, idx) => (
                                <div className="col-2" key={icon.prop}>
                                    <img src={icon.img} style={{maxWidth:40+"px"}}/>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            <div className="card-body">
                {this.props.notes}
            </div>
        </div>);
    }
}

export default PlayerCard;