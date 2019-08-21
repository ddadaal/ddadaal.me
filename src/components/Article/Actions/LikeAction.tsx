import React, { useState } from "react";

import { FaThumbsUp } from "react-icons/fa";
import Action from "@/components/Article/Actions/Action";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";

interface Props {
  articleId: string;
}

const root = lang.articlePage.actions.like;

const LikeAction: React.FC<Props> = () => {
  const [liked, setLiked] = useState(false);

  return (
    <Action Icon={FaThumbsUp}
      onClick={() =>
        setLiked(true)
      }
    >
      <LocalizedString id={liked ? root.liked : root.like}/>
    </Action>
  );

}

export default LikeAction;
