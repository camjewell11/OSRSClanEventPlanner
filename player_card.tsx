import React from 'react';
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

interface PlayerCardProps {
    level: number;
    account_type: string;
    ca_score: number;
    username: string;
    timezone: string;
    hours: string;
    notes: string;
    has_shadow?: boolean;
    has_tbow?: boolean;
    has_scythe?: boolean;
    has_quiver?: boolean;
    has_infernal?: boolean;
}

const accountTypes = new Map<string, any>([
    ["MAIN", type_main],
    ["IRON", type_iron],
    ["HCIM", type_hcim],
    ["UIM", type_uim],
    ["GIM", type_gim],
    ["HCGIM", type_hcgim],
    ["UGIM", type_ugim],
    ["SNOWFLAKE", type_snowflake],
]);

const caIcons = new Map<number, any>([
    [2525, ca_gm],
    [1841, ca_master],
    [1026, ca_elite],
    [394, ca_hard],
    [148, ca_med],
]);

const achievementIcons = [
    { prop: "has_quiver", img: achieve_quiver },
    { prop: "has_infernal", img: achieve_cape },
    { prop: "has_scythe", img: mega_scythe },
    { prop: "has_shadow", img: mega_staff },
    { prop: "has_tbow", img: mega_bow },
];

const PlayerCard: React.FC<PlayerCardProps> = ({
    level,
    account_type,
    ca_score,
    username,
    timezone,
    hours,
    notes,
    has_shadow = false,
    has_tbow = false,
    has_scythe = false,
    has_quiver = false,
    has_infernal = false,
}) => {
    let account_type_ico = type_unknown;
    if (accountTypes.has(account_type)) {
        account_type_ico = accountTypes.get(account_type);
    }

    let ca_icon = ca_easy;
    for (const [minPoints, ico] of caIcons) {
        if (ca_score >= minPoints) {
            ca_icon = ico;
            break;
        }
    }

    const activeAchievements = achievementIcons.filter(icon => {
        switch (icon.prop) {
            case "has_quiver": return has_quiver;
            case "has_infernal": return has_infernal;
            case "has_scythe": return has_scythe;
            case "has_shadow": return has_shadow;
            case "has_tbow": return has_tbow;
            default: return false;
        }
    });

    return (
        <div className="card border-secondary mb-3" style={{ width: 300 + "px" }}>
            <div className="card-header">
                <div className="row text-center align-items-center">
                    <div className="col-3 align-self-start">
                        Total:
                        <br />
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
                <img src={defaultImage} style={{ maxWidth: 280 + "px" }} />
            </div>
            <div className="card-body">
                <div className="row text-center align-items-center">
                    <div className="col-sm-6">
                        <div className="row text-center align-items-center">
                            <div className="col">
                                <img src={stopwatch} style={{ maxWidth: 40 + "px" }} />
                            </div>
                            <div className="col text-center align-items-center">
                                <div className="row text-center badge text-bg-primary">
                                    <h5>{timezone}</h5>
                                </div>
                                <div className="row text-bg-secondary rounded">
                                    {hours} hours
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="row align-items-center">
                            <img src={ca_icon} style={{ width: 60 + "px", height: 40 + "px" }} />
                            {ca_score}
                        </div>
                        <div className="row align-items-center">
                            <img src={account_type_ico} style={{ maxWidth: 60 + "px" }} />
                            {account_type}
                        </div>
                    </div>
                </div>
            </div>
            {activeAchievements.length > 0 && (
                <div className="card-body">
                    <div className="row align-items-center">
                        {activeAchievements.map((icon, idx) => (
                            <div className="col-2" key={icon.prop}>
                                <img src={icon.img} style={{ maxWidth: 40 + "px" }} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="card-body">
                {notes}
            </div>
        </div>
    );
};

export default PlayerCard;