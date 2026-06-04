import {createRoot} from "react-dom/client";
import App from "./component/app";
import { AuthProvider } from "./globalProps/authContext";

const root = createRoot(document.getElementById('root'))

root.render(
    <AuthProvider>
      <App/>
    </AuthProvider>  
)