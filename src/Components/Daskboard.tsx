import { AggregateResult, AmcatIndex, Articles } from "amcat4react";
import { Grid } from "semantic-ui-react";

interface DashboardProps {
  index?: AmcatIndex;
}

export default function Dashboard({ index }: DashboardProps) {
  if (index == null) return null;
  return (
    <>
      <Grid celled padded style={{ height: "100vh" }}>
        <Grid.Row stretched>
          <Grid.Column width={8}>
            <AggregateResult
              index={index}
              query={{}}
              height="100%"
              options={{
                display: "linechart",
                axes: [{ field: "date", interval: "week" }],
              }}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <AggregateResult
              index={index}
              query={{}}
              height="100%"
              options={{
                display: "barchart",
                axes: [{ field: "platform" }],
              }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Articles index={index} query={{}} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
