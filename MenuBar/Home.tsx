import PlayerCard from "../player_card";

export default function Home() {
  return (
    <PlayerCard
      level={2277}
      account_type={"MAIN"}
      username={"test"}
      ca_score={2525}
      hours={"40 - 50"}
      timezone={"EST"}
      has_shadow={true}
      notes="test"
    />
  );
}