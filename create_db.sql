CREATE TABLE clans (
    ClanID VARCHAR(256) PRIMARY KEY,
    ClanName VARCHAR(256)
);

CREATE TABLE users (
    Username VARCHAR(256) NOT NULL PRIMARY KEY,
    PasswdHash VARCHAR(256) NOT NULL,
    RunescapeName VARCHAR(256) UNIQUE CREATE INDEX,
    ClanID VARCHAR(256) FOREIGN KEY,
    CAPoints INT DEFAULT 0,
    AccountType ENUM(MAIN, IRON, GIM, UIM, HCIM, HCGIM, UGIM, SNWFLK, UNKNWN) DEFAULT UNKNWN,
    TotalLevel INT DEFAULT 32,
    TimeZone VARCHAR(6) DEFAULT "GMT",
    BigItems SET("NONE", "SHADOW", "TBOW", "SCYTHE", "INFERNAL_CAPE", "QUIVER"),
    Notes VARCHAR(4096)
);

CREATE TABLE events (
    EventID INT NOT NULL PRIMARY KEY,
    ClanID VARCHAR(256) FOREIGN KEY,
    EventName VARCHAR(256),
    EventType ENUM(PUNCHCARD) NOT NULL
    EventStart TIMESTAMP,
    EventEnd TIMESTAMP
);

CREATE TABLE punchcard_slot (
    SlotName VARCHAR(256) NOT NULL PRIMARY KEY,
    EVENTID INT NOT NULL FOREIGN KEY,
    SlotType ENUM(EXP, ITEM, KC, TIME_CHALLENGE),
    MaxAttempts INT DEFAULT 1,
    MaxAttemptsPerPlayer INT DEFAULT 1,
    PointTotal INT DEFAULT 1,
    Bonus INT DEFAULT 0,
    UnlockCriteria ENUM(AVAILABLE, TEIR, CARD_PATH),
    ArtUUID VARCHAR(256) -- can override default images, also sets require this
);
-- gain the given item
CREATE TABLE punchcard_item_slot (
    SlotName VARCHAR(256) NOT NULL FOREIGN KEY,
    EVENTID INT NOT NULL FOREIGN KEY,
    ItemID INT FOREIGN KEY
);

-- gain an threshold experience
CREATE TABLE punchcard_exp_slot (
    SlotName VARCHAR(256) NOT NULL,
    EVENTID INT NOT NULL FOREIGN KEY,
    Skill ENUM(ATTACK, STRENGTH, DEFENCE, RANGED, PRAYER, MAGIC, RUNECRAFT, HITPOINTS, CRAFTING, MINING, SMITHING, FISHING, COOKING, FIREMAKING, WOODCUTTING, AGILITY, HERBLORE, THEIVING, FLETCHING, SLAYER, FARMING, CONSTRUCTION, HUNTER) NOT NULL
    EXPTarget INT,
    Cumulative BOOLEAN -- if all players can contribute to this target
);

-- Get this many kc in the event. IF there is an unranked minimum, those KC don't count (automatically)
CREATE TABLE punchcard_kc_slot (
    SlotName VARCHAR(256) NOT NULL FOREIGN KEY,
    EVENTID INT NOT NULL FOREIGN KEY,
    Activity VARCHAR(256) FOREIGN KEY,
    KCTarget INT,
    CUMULATIVE BOOLEAN
);

-- have to get a time less than or equal to TimeTarget in Activity
CREATE TABLE punchcard_time_challenge_slot
{
    SlotName VARCHAR(256) NOT NULL FOREIGN KEY,
    EVENTID INT NOT NULL FOREIGN KEY,
    Activity VARCHAR(256) FOREIGN KEY,
    TimeTarget INT
};

-- activities, such as agility courses, bosses, etc
CREATE TABLE activities (
    Activity VARCHAR(256) NOT NULL PRIMARY KEY,
    ReadableName VARCHAR(256) NOT NULL,
    Icon VARCHAR(256),
    details VARCHAR(4096)
);

-- runescape items table
CREATE TABLE items (
    ItemName VARCHAR(256) NOT NULL PRIMARY KEY,
    ItemId INT UNIQUE,
    Icon VARCHAR(256)
    Activity VARCHAR(256) FOREIGN KEY -- allow linking to activities so we can have a view to select items you can obtain from a given activity
);

-- snapshots hold WOM information for the start of an event, used to check XP gain, boss KC gain, etc.
CREATE TABLE snapshots (
    EventID INT NOT NULL FOREIGN KEY,
    Username VARCHAR(256) FOREIGN KEY,
    SnapshotData VARCHAR(65535)
);

CREATE TABLE event_participants (
    EventID INT NOT NULL FOREIGN KEY,
    Username varchar(256) NOT NULL FOREIGN KEY,
    HoursMin FLOAT,
    HoursMax FLOAT
);

CREATE TABLE event_team (
    TeamID INT PRIMARY KEY,
    ClanID VARCHAR(256) FOREIGN KEY,
    TeamName VARCHAR(256),
    TeamCaptain VARCHAR(256),
    TentativeScore INT,
    ConfirmedScore INT
);

CREATE TABLE event_team_members (
    TeamID INT FOREIGN KEY,
    Username varchar(256) NOT NULL FOREIGN KEY
);

CREATE TABLE punchcard_score (
    EventID INT NOT NULL FOREIGN KEY,
    TeamID INT FOREIGN KEY,
    SlotName VARCHAR(256) NOT NULL FOREIGN KEY,
    Username VARCHAR(256) NOT NULL FOREIGN KEY,
    Evidence VARCHAR(256), -- can be WOM SNAPSHOT instead of an image
    Approved BOOLEAN,
    Approver VARCHAR(256)
);