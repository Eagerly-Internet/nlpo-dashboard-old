import {
  AggregateResult,
  AmcatIndex,
  Articles,
  LocationHeatmap,
} from "amcat4react";
import { Grid, Header, Segment } from "semantic-ui-react";

interface DashboardProps {
  index?: AmcatIndex;
}

export default function Dashboard({ index }: DashboardProps) {
  if (index == null) return null;
  console.log(index);

  return (
    <Grid celled padded>
      <Grid.Row style={{ height: "400px" }}>
        <Grid.Column width={8}>
          <Header>Aantal artikelen per week</Header>
          <AggregateResult
            index={index}
            query={{ filters: { platform: { values: ["Website"] } } }}
            height={350}
            options={{
              display: "linechart",
              axes: [{ field: "date", interval: "week" }],
            }}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <Header>Locaties in het nieuws</Header>
          <LocationHeatmap
            index={index}
            query={{ filters: { platform: { values: ["Website"] } } }}
            options={{
              field: "location_geo",
              width: "100%",
              height: 350,
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ height: "400px" }}>
        <Grid.Column width={8}>
          <Header>Aantal artikelen per auteur</Header>
          <AggregateResult
            index={index}
            query={{
              filters: {
                author: {
                  values: ["Andor Heij", "Gert van Akkeren", "Tom Veenstra"],
                },
              },
            }}
            height={350}
            options={{
              display: "barchart",
              axes: [{ field: "author" }],
            }}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <Header>Gebruikte tags in het nieuws</Header>
          <AggregateResult
            index={index}
            query={{
              filters: {
                author: {
                  values: ["Andor Heij", "Gert van Akkeren", "Tom Veenstra"],
                },
              },
            }}
            height={350}
            options={{
              display: "barchart",
              axes: [{ field: "tags" }],
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ height: "400px" }}>
        <Grid.Column width={16}>
          <Articles index={index} query={{}} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
