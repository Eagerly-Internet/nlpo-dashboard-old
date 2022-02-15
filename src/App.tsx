import { useState } from "react";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import { AmcatIndex, IndexLogin } from "amcat4react";
import { Modal } from "semantic-ui-react";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "nlpo-dashboard-oogtv",
  ]);
  const [index, setIndex] = useState<AmcatIndex>(
    cookies["nlpo-dashboard-oogtv"]
  );

  const handleLogin = (index: AmcatIndex) => {
    setCookie("nlpo-dashboard-oogtv", JSON.stringify(index));
    setIndex(index);
  };

  return (
    <div className="App">
      <Dashboard index={index} />
      <Modal open={!index}>
        <Modal.Content>
          <IndexLogin
            host="http://localhost:5000"
            index="oogtv"
            onLogin={handleLogin}
          />
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default App;
