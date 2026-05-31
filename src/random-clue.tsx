import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { useMemo, useState } from "react";

import {
  getClueMarkdown,
  getCountryClues,
  getRandomCountryClue,
} from "./clues";

const clues = getCountryClues();

const Command = () => {
  const [nonce, setNonce] = useState(0);
  const clue = useMemo(() => getRandomCountryClue(clues), [nonce]);

  if (!clue) {
    return <Detail markdown="# No clues found" />;
  }

  return (
    <Detail
      navigationTitle="Random Country Clue"
      markdown={getClueMarkdown(clue)}
      actions={
        <ActionPanel>
          <Action
            title="Pick Another Random Country"
            icon={Icon.ArrowClockwise}
            onAction={() => setNonce(nonce + 1)}
          />
          <Action.CopyToClipboard
            title="Copy Country Name"
            content={clue.name}
          />
          <Action.CopyToClipboard
            title="Copy Description"
            content={clue.description}
          />
          <Action.CopyToClipboard
            title="Copy Country and Description"
            content={`${clue.name}\n\n${clue.description}`}
          />
        </ActionPanel>
      }
    />
  );
};

export default Command;
