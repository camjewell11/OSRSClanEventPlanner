import { h } from "preact";

type PlayerCardProps = {
  total: number;
  name: string;
  profileImg: string;
  hoursLabel: string;
  hours: string;
  caImg: string;
  caValue: number;
  coinsImg: string;
  accountType: string;
  itemImgs: string[];
  notes: string;
};

export function PlayerCard({
  total,
  name,
  profileImg,
  hoursLabel,
  hours,
  caImg,
  caValue,
  coinsImg,
  accountType,
  itemImgs,
  notes,
}: PlayerCardProps) {
  return (
    <div class="card border-secondary mb-3" style="width: 300px;">
      <div class="card-header">
        <div class="row text-center align-items-center">
          <div class="col-3 align-self-start">
            Total:
            <br />
            <span class="badge text-bg-success rounded-circle">{total}</span>
          </div>
          <div class="col badge text-bg-secondary">
            <h4>{name}</h4>
          </div>
        </div>
      </div>
      <div class="card-body">
        <img src={profileImg} style="max-width: 280px;" />
      </div>
      <div class="card-body">
        <div class="row text-center align-items-center">
          <div class="col-sm-6">
            <div class="row text-center align-items-center">
              <div class="col">
                <img src="/images/jagex/Giant_stopwatch_detail.webp" style="max-width: 40px;" />
              </div>
              <div class="col text-center align-items-center">
                <div class="row text-center badge text-bg-primary">
                  <h5>{hoursLabel}</h5>
                </div>
                <div class="row text-bg-secondary rounded">{hours}</div>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="row align-items-center">
              <img src={caImg} style="width: 60px; height: 40px;" />
              {caValue}
            </div>
            <div class="row align-items-center">
              <img src={coinsImg} style="max-width:60px;" />
              {accountType}
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="row align-items-center">
          {itemImgs.map((img, idx) => (
            <div class="col-2" key={idx}>
              <img src={img} style="max-width:40px;" />
            </div>
          ))}
        </div>
      </div>
      <div class="card-body">{notes}</div>
    </div>
  );
}