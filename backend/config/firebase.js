import { initializeApp, cert } from "firebase-admin/app";
import serviceAccount from "./it332-capstone-prepapig-firebase-adminsdk-fbsvc-c0acea9db2.json" with { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount),
});

export default app;