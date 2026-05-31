import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useMemo, useState } from "react";

import { getClueMarkdown, getCountryClues } from "./clues";

const clues = getCountryClues();

const Command = () => {
  const [searchText, setSearchText] = useState("");

  const filteredClues = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return clues;
    }

    return clues.filter((clue) =>
      clue.name.toLowerCase().includes(normalizedSearch),
    );
  }, [searchText]);

  return (
    <List
      isShowingDetail
      navigationTitle="Country Clues"
      searchBarPlaceholder="Search by country name..."
      searchText={searchText}
      onSearchTextChange={setSearchText}
      filtering={false}
    >
      <List.Section
        title="Countries"
        subtitle={`${filteredClues.length} shown`}
      >
        {filteredClues.map((clue) => (
          <List.Item
            key={clue.name}
            icon={Icon.Globe}
            title={clue.name}
            subtitle={clue.categories.join(", ") || "Clues"}
            accessories={[
              { text: `${clue.description.split(/\s+/).length} words` },
            ]}
            detail={<List.Item.Detail markdown={getClueMarkdown(clue)} />}
            actions={
              <ActionPanel>
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
        ))}
      </List.Section>

      {filteredClues.length === 0 ? (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title="No countries found"
          description="Try searching for another country name."
        />
      ) : null}
    </List>
  );
};

export default Command;
