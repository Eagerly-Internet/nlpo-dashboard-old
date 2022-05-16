import { AmcatUser } from "amcat4react";
import { useState } from "react";
import { Menu } from "semantic-ui-react";
import DashboardNLPO from "./DashboardNLPO";
import DashboardOmroep from "./DashboardOmroep";

interface DashboardsProps {
  user?: AmcatUser;
}

const DASHBOARDS = new Map([
  ["NLPO", (u: AmcatUser) => <DashboardNLPO index={{ ...u, index: "nlpo" }} />],
  [
    "TV Valkenburg",
    (u: AmcatUser) => (
      <DashboardOmroep index={{ ...u, index: "tvvalkenburg" }} />
    ),
  ],
]);

function get_dashboard(user: AmcatUser, name: string) {
  const fn = DASHBOARDS.get(name);
  return fn && fn(user);
}

export default function Dashboards({ user }: DashboardsProps) {
  const [selected, setSelected] = useState("NLPO");
  return (
    <>
      <Menu attached="top" tabular>
        {Array.from(DASHBOARDS.keys()).map((name) => (
          <Menu.Item
            name={name}
            key={name}
            active={!!user && selected == name}
            disabled={!user}
            onClick={() => setSelected(name)}
          />
        ))}
      </Menu>{" "}
      <p>&nbsp;</p>
      {user ? get_dashboard(user, selected) : null}
    </>
  );
}
