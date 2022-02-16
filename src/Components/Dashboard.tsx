import { AggregateResult, AmcatIndex, Articles, LocationHeatmap } from "amcat4react";
import { Grid, Header } from "semantic-ui-react";

interface DashboardProps {
  index?: AmcatIndex;
}

export default function Dashboard({ index }: DashboardProps) {
  if (index == null) return null;
  return (
    <>
      <Grid celled padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={16}>
          <Header>Aantal artikelen per week</Header>
            <AggregateResult
              index={index}
              query={{filters: {platform: {values: ["Website"]}}}}
              height={400}
              options={{
                display: "linechart",
                axes: [{ field: "date", interval: "week" }, {field: "omroep"}],
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={8}>
          <Header>Aantal artikelen/posts per platform</Header>
            <AggregateResult
              index={index}
              query ={{}}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "omroep"}, {field: "platform"}],
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header>Locaties in het nieuws</Header>
            <LocationHeatmap
              index={index}
              query={{filters: {platform: {values: ["Website"]}}}}
              options={{field: "location_geo", width: "100%"}}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <Grid.Column width={8}>
          <Header>Populaire tags</Header>
            <AggregateResult
              index={index}
              query ={{}}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "tags"}],
                limit: 10
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
          <Header>Journalisten</Header>
            <AggregateResult
              index={index}
              query ={{}}
              height={400}
              options={{
                display: "barchart",
                axes: [{ field: "author"}],
                limit: 10
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
