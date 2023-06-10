import { Localized } from "src/i18n";

interface Props {
  time: string;
}

export const LastUpdateTime = ({ time }: Props) => {
  return (
    <p>
      ⏲️ <Localized id="statistics.lastUpdated" />: &nbsp;
      {time}
    </p>
  );
};
