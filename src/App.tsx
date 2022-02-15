import { useState } from "react";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import { AmcatIndex, IndexLogin } from "amcat4react";
import { Modal } from "semantic-ui-react";


function App() {
  const [index, setIndex] = useState<AmcatIndex>();

  return (
    <div className="App">
      <Dashboard index={index} />
      <Modal open={!index}>
        <Modal.Content>
          <IndexLogin
            host="http://localhost:5000"
            index="oogtv"
            onLogin={setIndex}
          />
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default App;
