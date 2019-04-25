import React, { useState } from "react";

import { FaThumbsUp } from "react-icons/fa";
import Action from "@/components/Article/ActionSidebar/Action";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";

interface Props {
  articleId: string;
}

const root = lang.articlePage.actionSidebar;

export default function ThumbUpAction({ articleId }: Props) {
  const [ thumbedUp, setThumbedUp ] = useState(false);

  return (
    <Action Icon={FaThumbsUp}
            onClick={() =>
                  setThumbedUp(true)
            }
    >
      <LocalizedString id={thumbedUp ? root.thumbedUp : root.thumbUp}/>
    </Action>
  );

}
