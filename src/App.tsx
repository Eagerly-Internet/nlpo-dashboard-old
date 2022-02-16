import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import { Amcat, AmcatIndex, IndexLogin } from "amcat4react";
import { Modal } from "semantic-ui-react";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "nlpo-dashboard-nlpo",
  ]);
  const [index, setIndex] = useState<AmcatIndex>();

  useEffect(() => {
    const ix: AmcatIndex = cookies["nlpo-dashboard-nlpo"]
    console.log(ix);
    if (ix == null) return;
    // Check login  
    // TODO: would be better to reset token, but that expects a password for now
     Amcat.getIndices(ix).then((_d)=> setIndex(ix)).catch((error) => {
       console.error(error);
       removeCookie("nlpo-dashboard-nlpo")
     })
  }, [index, setIndex, cookies, setCookie, removeCookie])

  const handleLogin = (index: AmcatIndex) => {
    setCookie("nlpo-dashboard-nlpo", JSON.stringify(index));
    setIndex(index);
  };

  return (
    <div className="App">
      <Dashboard index={index} />
      <Modal open={!index}>
        <Modal.Content>
          <IndexLogin
            host="http://localhost:5000"
            index="nlpo"
            onLogin={handleLogin}
          />
        </Modal.Content>
      </Modal>
    </div>
  );
}

export default App;
